export const connection = {
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // Required for BullMQ to avoid retry issues
};
