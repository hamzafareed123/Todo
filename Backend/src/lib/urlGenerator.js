import { ENV } from "./env.js";
export const generateFileUrl = (filePath, req) => {
  if (!filePath) return null;
  const baseUrl = ENV.BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}${filePath}`;
};
