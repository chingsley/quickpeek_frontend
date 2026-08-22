import { useActionSheet } from '@/components/shared/useActionSheet';
import { notifConfig } from '@/config';
import { oauthLogin, OAuthProvider } from '@/services/auth.services';
import { useAuthStore } from '@/store/auth.store';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AccessTokenRequest, AuthRequest } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

/**
 * Social sign-in entrypoint used by the auth landing screen.
 *
 * Strategy per provider (matches the backend verifier in
 * `quickpeek_backend/src/modules/auth/providers/providerVerifier.ts`):
 *
 *  - Google    → iOS native OAuth (expo-auth-session Google provider + iOS
 *                client ID + reversed URL scheme) on iOS standalone builds;
 *                web-redirect id_token flow on web (and Android until an
 *                Android OAuth client exists).
 *  - Apple     → native iOS SDK via `expo-apple-authentication` on iOS;
 *                web-redirect flow with the Apple Services ID on Android/web.
 *  - Facebook  → browser OAuth; native iOS uses fb{APP_ID}://authorize redirect.
 *
 * All flows end the same way: POST /auth/oauth → `authStore.login(...)`.
 */
export const useSocialAuth = () => {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { showActionSheet, actionSheet } = useActionSheet();
  const [activeProvider, setActiveProvider] = useState<OAuthProvider | null>(null);
  const inFlightRef = useRef(false);

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  const googleReversedClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID?.trim();
  const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID?.trim();

  const redirectUri = makeRedirectUri({
    scheme: 'quickpeekfrontend',
    path: 'oauthredirect',
  });

  // Facebook mobile OAuth must use Meta's fb{APP_ID}://authorize redirect — not
  // quickpeekfrontend://. The Valid OAuth Redirect URIs validator rejects custom schemes.
  const facebookRedirectUri = useMemo(() => {
    if (Platform.OS === 'web' || !facebookAppId) {
      return redirectUri;
    }
    return `fb${facebookAppId}://authorize`;
  }, [facebookAppId, redirectUri]);

  const googleRedirectOptions = useMemo(
    () => ({
      scheme: 'quickpeekfrontend',
      path: 'oauthredirect',
      ...(Platform.OS === 'ios' && googleReversedClientId
        ? { native: `${googleReversedClientId}:/oauthredirect` }
        : {}),
    }),
    [googleReversedClientId],
  );

  const [googleRequest, , googlePromptAsync] = Google.useAuthRequest(
    {
      iosClientId,
      webClientId,
      // Until an Android OAuth client exists, fall back to the web client id so
      // the hook can mount on Android without throwing (flow may still fail at
      // Google's consent screen until a dedicated Android client is added).
      androidClientId: webClientId,
      clientId: webClientId,
    },
    googleRedirectOptions,
  );

  const openAuthSession = useCallback(
    async (
      authUrl: string,
      sessionRedirectUri: string,
    ): Promise<Record<string, string> | null> => {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, sessionRedirectUri);
      if (result.type !== 'success') return null;
      const url = new URL(result.url);
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      const hash = result.url.split('#')[1];
      if (hash) {
        new URLSearchParams(hash).forEach((value, key) => {
          params[key] = value;
        });
      }
      return params;
    },
    [],
  );

  const resolveProviderResult = useCallback(
    async (provider: OAuthProvider): Promise<{
      idToken?: string;
      accessToken?: string;
      nonce: string;
      name?: string;
    }> => {
      const rawNonce = Crypto.randomUUID();
      const hashedNonce = await sha256Hex(rawNonce);

      if (provider === 'google') {
        if (Platform.OS === 'ios' && iosClientId) {
          return googleIosFlow({
            googleRequest,
            googlePromptAsync,
            iosClientId,
          }).then((tokens) => ({
            idToken: tokens.idToken,
            nonce: rawNonce,
            name: tokens.name,
          }));
        }

        return googleWebFlow({ redirectUri, hashedNonce, openAuthSession, webClientId }).then(
          (tokens) => ({
            idToken: tokens.idToken,
            nonce: rawNonce,
            name: tokens.name,
          }),
        );
      }

      if (provider === 'apple' && Platform.OS === 'ios') {
        return appleNativeFlow(hashedNonce).then((cred) => ({
          idToken: cred.identityToken ?? undefined,
          nonce: rawNonce,
          name: cred.fullName
            ? [cred.fullName.givenName, cred.fullName.familyName]
                .filter(Boolean)
                .join(' ') || undefined
            : undefined,
        }));
      }

      if (provider === 'apple') {
        return appleWebFlow({ redirectUri, hashedNonce, openAuthSession }).then((tokens) => ({
          idToken: tokens.idToken,
          nonce: rawNonce,
        }));
      }

      return facebookWebFlow({ redirectUri: facebookRedirectUri, openAuthSession }).then((tokens) => ({
        accessToken: tokens.accessToken,
        nonce: rawNonce,
      }));
    },
    [
      facebookRedirectUri,
      googlePromptAsync,
      googleRequest,
      iosClientId,
      openAuthSession,
      redirectUri,
      webClientId,
    ],
  );

  const signInWith = useCallback(
    async (provider: OAuthProvider) => {
      if (inFlightRef.current || activeProvider) return;
      inFlightRef.current = true;
      setActiveProvider(provider);
      try {
        const deviceToken = await notifConfig.registerForPushNotificationsAsync();
        const deviceType =
          Platform.OS === 'web' ? 'web' : Platform.OS === 'ios' ? 'ios' : 'android';

        const credentials = await resolveProviderResult(provider);

        if (
          (provider !== 'facebook' && !credentials.idToken) ||
          (provider === 'facebook' && !credentials.accessToken)
        ) {
          return;
        }

        const response = await oauthLogin({
          provider,
          idToken: credentials.idToken,
          accessToken: credentials.accessToken,
          nonce: credentials.nonce,
          name: credentials.name,
          deviceType,
          deviceToken,
          notificationsEnabled: !!deviceToken,
          locationSharingEnabled: true,
        });

        if (response?.data) {
          const { user, token } = response.data;
          await login(user.locationSharingEnabled, user, token);
          router.replace('/(tabs)/Home');
        }
      } catch (err: any) {
        if (err?.type === 'dismiss' || err?.code === 'E_CANCELLED') {
          return;
        }
        const status = err?.response?.status;
        const serverError =
          err?.response?.data?.error || err?.message || 'Sign-in failed. Please try again.';

        if (status === 409) {
          showActionSheet({
            title: 'Account already exists',
            message:
              'An account with this email already exists. Sign in with your password first, then link this provider from settings.',
            tone: 'error',
          });
        } else if (status === 401) {
          showActionSheet({
            title: 'Sign-in failed',
            message: serverError,
            tone: 'error',
          });
        } else if (!err?.response) {
          showActionSheet({
            title: 'Connection problem',
            message: 'Could not reach QuickPeek. Check your connection and try again.',
            tone: 'error',
          });
        } else {
          showActionSheet({ title: 'Sign-in failed', message: serverError, tone: 'error' });
        }
      } finally {
        inFlightRef.current = false;
        setActiveProvider(null);
      }
    },
    [activeProvider, login, resolveProviderResult, router, showActionSheet],
  );

  return { signInWith, activeProvider, isLoading: activeProvider !== null, actionSheet };
};

// ─── Provider flow primitives ───────────────────────────────────────────────

type OpenAuthSession = (
  authUrl: string,
  sessionRedirectUri: string,
) => Promise<Record<string, string> | null>;
type GooglePromptAsync = ReturnType<typeof Google.useAuthRequest>[2];

interface GoogleWebResult {
  idToken?: string;
  name?: string;
}

const googleWebFlow = async (input: {
  redirectUri: string;
  hashedNonce: string;
  openAuthSession: OpenAuthSession;
  webClientId?: string;
}): Promise<GoogleWebResult> => {
  if (!input.webClientId) {
    throw new Error('Google sign-in is not configured for this build.');
  }
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', input.webClientId);
  authUrl.searchParams.set('redirect_uri', input.redirectUri);
  authUrl.searchParams.set('response_type', 'id_token');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('nonce', input.hashedNonce);

  const params = await input.openAuthSession(authUrl.toString(), input.redirectUri);
  if (!params) return {};
  return { idToken: params.id_token };
};

interface GoogleIosResult {
  idToken?: string;
  name?: string;
}

const googleIosFlow = async (input: {
  googleRequest: AuthRequest | null;
  googlePromptAsync: GooglePromptAsync;
  iosClientId: string;
}): Promise<GoogleIosResult> => {
  if (!input.googleRequest) {
    throw new Error('Google sign-in is still loading. Please try again.');
  }

  const result = await input.googlePromptAsync();
  if (result.type !== 'success') return {};

  let idToken: string | undefined = result.params.id_token;

  // Installed iOS apps use the authorization-code + PKCE flow; exchange the
  // code for tokens (including id_token) when the prompt result only has `code`.
  if (!idToken && result.params.code) {
    const exchangeRequest = new AccessTokenRequest({
      clientId: input.iosClientId,
      redirectUri: input.googleRequest.redirectUri,
      code: result.params.code,
      extraParams: {
        code_verifier: input.googleRequest.codeVerifier || '',
      },
    });
    const authentication = await exchangeRequest.performAsync(Google.discovery);
    idToken = authentication.idToken ?? undefined;
  }

  return { idToken };
};

interface AppleNativeCredentials {
  identityToken: string | null;
  fullName: AppleAuthentication.AppleAuthenticationFullName | null;
}

const appleNativeFlow = async (hashedNonce: string): Promise<AppleNativeCredentials> => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
    state: Crypto.randomUUID(),
  });
  return { identityToken: credential.identityToken, fullName: credential.fullName };
};

interface AppleWebResult {
  idToken?: string;
}

const appleWebFlow = async (input: {
  redirectUri: string;
  hashedNonce: string;
  openAuthSession: OpenAuthSession;
}): Promise<AppleWebResult> => {
  const clientId = process.env.EXPO_PUBLIC_APPLE_SERVICE_ID;
  if (!clientId) {
    throw new Error('Apple sign-in is not configured for this build.');
  }
  const authUrl = new URL('https://appleid.apple.com/auth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', input.redirectUri);
  authUrl.searchParams.set('response_type', 'code id_token');
  authUrl.searchParams.set('response_mode', 'fragment');
  authUrl.searchParams.set('scope', 'name email');
  authUrl.searchParams.set('nonce', input.hashedNonce);
  authUrl.searchParams.set('state', Crypto.randomUUID());

  const params = await input.openAuthSession(authUrl.toString(), input.redirectUri);
  if (!params) return {};
  return { idToken: params.id_token };
};

interface FacebookWebResult {
  accessToken?: string;
}

const facebookWebFlow = async (input: {
  redirectUri: string;
  openAuthSession: OpenAuthSession;
}): Promise<FacebookWebResult> => {
  const appId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
  if (!appId) {
    throw new Error('Facebook sign-in is not configured for this build.');
  }
  const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
  authUrl.searchParams.set('client_id', appId);
  authUrl.searchParams.set('redirect_uri', input.redirectUri);
  authUrl.searchParams.set('response_type', 'token');
  authUrl.searchParams.set('scope', 'email');
  authUrl.searchParams.set('display', 'touch');
  authUrl.searchParams.set('state', Crypto.randomUUID());

  const params = await input.openAuthSession(authUrl.toString(), input.redirectUri);
  if (!params) return {};
  return { accessToken: params.access_token };
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const sha256Hex = async (input: string): Promise<string> => {
  try {
    return (await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      input,
      { encoding: Crypto.CryptoEncoding.HEX },
    )) as string;
  } catch {
    if (typeof globalThis.crypto?.subtle !== 'undefined') {
      const buf = await globalThis.crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(input),
      );
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    return input;
  }
};

export const OAUTH_REDIRECT_PATH = 'oauthredirect';
