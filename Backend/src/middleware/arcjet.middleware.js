import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req,{fingerprint: "test-user-1"});
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Too many request" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied" });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by Security Policy..." });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        message: "Malicious Bot activity detected",
        error: "Spoofed bot detected",
      });
    }

    next();
  } catch (error) {
    console.log("Error while Protecting:", error);
    next();
  }
};
