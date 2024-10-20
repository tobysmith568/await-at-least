import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { awaitAtLeast } from "./await-at-least";

describe("awaitAtLeast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("when the given promise has already resolved", () => {
    it("should wait the full duration before resolving itself", async () => {
      const resolvedPromise = Promise.resolve("resolved");

      let hasResolved = false;
      awaitAtLeast(500, resolvedPromise).then(() => (hasResolved = true));

      expect(hasResolved).toBe(false);
      await vi.advanceTimersByTimeAsync(499);
      expect(hasResolved).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect(hasResolved).toBe(true);
    });

    it("should return the resolved value", async () => {
      const resolvedPromise = Promise.resolve("resolved");

      const resultPromise = awaitAtLeast(500, resolvedPromise);
      await vi.advanceTimersByTimeAsync(500);

      const result = await resultPromise;
      expect(result).toBe("resolved");
    });
  });

  describe("when the given promise has already rejected", () => {
    it("should wait the full duration before rejecting itself", async () => {
      const rejectedPromise = Promise.reject(new Error("rejected"));

      let hasRejected = false;
      awaitAtLeast(500, rejectedPromise).catch(() => (hasRejected = true));

      expect(hasRejected).toBe(false);
      await vi.advanceTimersByTimeAsync(499);
      expect(hasRejected).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect(hasRejected).toBe(true);
    });

    it("should reject the rejected value", async () => {
      const rejectedPromise = Promise.reject(new Error("rejected"));

      const resultPromise = awaitAtLeast(500, rejectedPromise);

      let error: unknown;
      awaitAtLeast(500, resultPromise).catch(e => (error = e));

      await vi.advanceTimersByTimeAsync(500);

      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("rejected");
    });
  });

  describe("when the given promise has not yet resolved", () => {
    it("should wait the full duration before resolving itself", async () => {
      const promiseDuration = 300;
      const awaitDuration = 500;

      const resolvedPromise = new Promise<string>(resolve =>
        setTimeout(() => resolve("resolved"), promiseDuration)
      );

      let hasResolved = false;
      awaitAtLeast(awaitDuration, resolvedPromise).then(() => (hasResolved = true));

      expect(hasResolved).toBe(false);
      await vi.advanceTimersByTimeAsync(499);
      expect(hasResolved).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect(hasResolved).toBe(true);
    });

    it("should return the resolved value", async () => {
      const promiseDuration = 300;
      const awaitDuration = 500;

      const resolvedPromise = new Promise<string>(resolve =>
        setTimeout(() => resolve("resolved"), promiseDuration)
      );

      const resultPromise = awaitAtLeast(awaitDuration, resolvedPromise);
      await vi.advanceTimersByTimeAsync(500);

      const result = await resultPromise;
      expect(result).toBe("resolved");
    });
  });

  describe("when the given promise has not yet rejected", () => {
    it("should wait the full duration before rejecting itself", async () => {
      const promiseDuration = 300;
      const awaitDuration = 500;

      const rejectedPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("rejected")), promiseDuration)
      );

      let hasRejected = false;
      awaitAtLeast(awaitDuration, rejectedPromise).catch(() => (hasRejected = true));

      expect(hasRejected).toBe(false);
      await vi.advanceTimersByTimeAsync(499);
      expect(hasRejected).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect(hasRejected).toBe(true);
    });

    it("should reject the rejected value", async () => {
      const promiseDuration = 300;
      const awaitDuration = 500;

      const rejectedPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("rejected")), promiseDuration)
      );

      const resultPromise = awaitAtLeast(awaitDuration, rejectedPromise);

      let error: unknown;
      awaitAtLeast(awaitDuration, resultPromise).catch(e => (error = e));

      await vi.advanceTimersByTimeAsync(500);

      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("rejected");
    });
  });
});
