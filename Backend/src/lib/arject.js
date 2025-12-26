import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";
import http from "node:http";
import { ENV } from "./env.js";

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
        mode:ENV.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",


      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW"],
    }),

    tokenBucket({
      mode: "LIVE",

      refillRate: 5,
      interval: 60,
      capacity: 4,
    }),
  ],
});

export default aj;
