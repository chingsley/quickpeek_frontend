/** @type {import('expo/config').ExpoConfig} */
module.exports = () => {
  const base = require('./app.json').expo;
  const googleReversed = process.env.EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID?.trim();
  const facebookAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID?.trim();

  // Google iOS OAuth redirects back via the reversed client ID URL scheme
  // (see the plist Google lets you download when creating the iOS OAuth client).
  // Facebook iOS OAuth uses fb{APP_ID}://authorize (Meta's mobile redirect).
  const schemes = [base.scheme];
  if (googleReversed) {
    schemes.push(googleReversed);
  }
  if (facebookAppId) {
    schemes.push(`fb${facebookAppId}`);
  }

  return {
    ...base,
    scheme: schemes.length === 1 ? schemes[0] : schemes,
  };
};
