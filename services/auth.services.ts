import Axios from '@/config/axios.config'; // Using configured axios instance

export type OAuthProvider = 'google' | 'apple' | 'facebook';

export const registerUser = async (userData: any) => {
  try {
    const response = await Axios.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const response = await Axios.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error('\nAxios.getUri(): ', Axios.getUri(), '\n');
    throw error;
  }
};

/**
 * Exchange a verified third-party credential (Google/Apple id_token, or
 * Facebook access_token) for a QuickPeek session. The response shape is
 * identical to `loginUser` — `{ data: { user, token } }` — so the caller can
 * drive `authStore.login(...)` identically for both flows.
 *
 * The server verifies the credential, finds-or-creates the User, and issues
 * the standard 30-day JWT. See backend `src/modules/auth/`.
 */
export const oauthLogin = async (payload: {
  provider: OAuthProvider;
  /** Google + Apple send an id_token; Facebook does not. */
  idToken?: string;
  /** Facebook sends an access_token; Google/Apple do not. */
  accessToken?: string;
  /** Anti-replay nonce. Required for Apple, optional elsewhere. */
  nonce?: string;
  /** Apple only ships the user's real name on the FIRST auth. */
  name?: string;
  deviceType: string;
  deviceToken: string;
  notificationsEnabled: boolean;
  locationSharingEnabled: boolean;
}) => {
  const response = await Axios.post('/auth/oauth', payload);
  return response.data as {
    message: string;
    data: { user: any; token: string };
  };
};
