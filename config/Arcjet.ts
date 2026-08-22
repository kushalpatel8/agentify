import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/next';

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  // Keyed per userId so each user has their own independent bucket
  characteristics: ['userId'],
  rules: [
    // 1. Shield protection against common web attacks
    shield({
      mode: 'LIVE',
    }),
    // 2. Detect and block malicious bots
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE'],
    }),
    // 3. Per-user token bucket for agent creation:
    //    - capacity: 5000 tokens max
    //    - refillRate: 5000 tokens restored every 5 days (432000 seconds)
    //    - each agent creation costs 2500 tokens (requested at call site)
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5000,
      interval: 432000,
      capacity: 5000,
    }),
  ],
});