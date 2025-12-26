import { isSpoofedBot } from "@arcjet/inspect";
import aj from "../lib/arject.js";

export const arjectProtect = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit reached. Please try again later" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access Denied" });
      } else if (decision.results.some(isSpoofedBot)) {
        return res
          .status(403)
          .json({ message: "Malicious Boot Activity detected" });
      } else {
        return res
          .status(403)
          .json({ message: "Access Denied By Security Policies" });
      }
    }

    next();
  } catch (error) {
    console.log("Erro in arject ", error);
    return res.status(500).json({ message: "Security Check Failed" });
  }
};
