// Simulates real network latency (300 to 900 ms) as specified in requirements
export const delay = (minMs: number = 300, maxMs: number = 850): Promise<void> => {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

