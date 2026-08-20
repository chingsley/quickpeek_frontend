/** @type {import('expo/config').ExpoConfig} */
module.exports = () => {
  const base = require('./app.json').expo;
  const googleReversed = process.env.EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID?.trim();

  // Google iOS OAuth redirects back via the reversed client ID URL scheme
  // (see the plist Google lets you download when creating the iOS OAuth client).
  // Keep `quickpeekfrontend` for Apple/Facebook/deep links.
  const scheme = googleReversed ? [base.scheme, googleReversed] : base.scheme;

  return {
    ...base,
    scheme,
  };
};
