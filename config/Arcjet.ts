import arcjet, { tokenBucket } from "@arcjet/next";
export const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      characteristics: ["userId"], // track requests by a custom user ID
      refillRate: 5000, // refill 5 tokens per interval
      interval: 30 * 24 * 60 * 60, // refill every 10 seconds
      capacity: 5000, // bucket maximum capacity of 10 tokens
    }),
  ],
});