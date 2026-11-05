import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import { advanceTimersByTimeAsync } from "./test-utils";
import { wait } from "./wait";

describe("wait", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should wait the given duration before resolving", async () => {
    let hasResolved = false;
    wait(500).then(() => (hasResolved = true));

    expect(hasResolved).toBe(false);
    await advanceTimersByTimeAsync(499);
    expect(hasResolved).toBe(false);
    await advanceTimersByTimeAsync(1);
    expect(hasResolved).toBe(true);
  });
});
