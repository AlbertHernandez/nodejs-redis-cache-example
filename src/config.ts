export const config = {
  server: {
    port: process.env.PORT || 3000,
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
};
