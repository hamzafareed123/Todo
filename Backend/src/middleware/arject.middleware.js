import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../lib/arject.js";
import { customError } from "../lib/customError.js";

export const arjectProtect = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new customError(
          "Rate limit reached. Please try again later",
          429
        );
      } else if (decision.reason.isBot()) {
        throw new customError("Bot access Denied", 403);
      } else if (decision.results.some(isSpoofedBot)) {
        throw new customError("Malicious Boot Activity detected", 403);
      } else {
        throw new customError("Access Denied By Security Policies", 403);
      }
    }

    next();
  } catch (error) {
    return next(new customError("security check Failed", 500));
  }
};
