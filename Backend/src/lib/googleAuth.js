import { google } from "googleapis";
import { ENV } from "./env.js";

export const oauth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_CLIENT_ID,
  ENV.GOOGLE_CLIENT_SECRET,
  ENV.GOOGLE_REDIRECT_URI
);

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.profile",
 
  "https://www.googleapis.com/auth/userinfo.email",
];

export const getGoogleAuthURL = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_SCOPES,
    prompt: "consent",
  });
};
