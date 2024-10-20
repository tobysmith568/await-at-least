import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { wait } from "./wait";

describe("wait", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should wait the given duration before resolving", async () => {
    let hasResolved = false;
    wait(500).then(() => (hasResolved = true));

    expect(hasResolved).toBe(false);
    await vi.advanceTimersByTimeAsync(499);
    expect(hasResolved).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(hasResolved).toBe(true);
  });
});
