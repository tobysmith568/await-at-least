import { jest } from "bun:test";

/**
 * Bun's `jest` object has no async variant of `advanceTimersByTime`, so this advances the fake
 * timers and then waits for a macrotask, which lets every pending promise continuation run first.
 */
export const advanceTimersByTimeAsync = async (ms: number) => {
  jest.advanceTimersByTime(ms);
  await new Promise<void>(resolve => setImmediate(resolve));
};
