import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { awaitAtLeastOrReject } from "./await-at-least-or-reject";

describe("awaitAtLeastOrReject", () => {
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
      awaitAtLeastOrReject(500, resolvedPromise).then(() => (hasResolved = true));

      expect(hasResolved).toBe(false);
      await vi.advanceTimersByTimeAsync(499);
      expect(hasResolved).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect(hasResolved).toBe(true);
    });

    it("should return the resolved value", async () => {
      const resolvedPromise = Promise.resolve("resolved");

      const resultPromise = awaitAtLeastOrReject(500, resolvedPromise);
      await vi.advanceTimersByTimeAsync(500);

      const result = await resultPromise;
      expect(result).toBe("resolved");
    });
  });

  describe("when the given promise has already rejected", () => {
    it("should reject immediately", async () => {
      const rejectedPromise = Promise.reject(new Error("rejected"));

      let hasRejected = false;
      awaitAtLeastOrReject(500, rejectedPromise).catch(() => (hasRejected = true));

      await vi.advanceTimersByTimeAsync(1);
      expect(hasRejected).toBe(true);
    });

    it("should reject the rejected value", async () => {
      const rejectedPromise = Promise.reject(new Error("rejected"));

      const resultPromise = awaitAtLeastOrReject(500, rejectedPromise);

      let error: unknown;
      awaitAtLeastOrReject(500, resultPromise).catch(e => (error = e));

      await vi.advanceTimersByTimeAsync(1);
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
      awaitAtLeastOrReject(awaitDuration, resolvedPromise).then(() => (hasResolved = true));

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

      const resultPromise = awaitAtLeastOrReject(awaitDuration, resolvedPromise);
      await vi.advanceTimersByTimeAsync(500);

      const result = await resultPromise;
      expect(result).toBe("resolved");
    });
  });

  describe("when the given promise has not yet rejected", () => {
    it("should reject when the promise rejects", async () => {
      const promiseDuration = 300;
      const awaitDuration = 500;

      const rejectedPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("rejected")), promiseDuration)
      );

      let hasRejected = false;
      awaitAtLeastOrReject(awaitDuration, rejectedPromise).catch(() => (hasRejected = true));

      expect(hasRejected).toBe(false);
      await vi.advanceTimersByTimeAsync(300);
      expect(hasRejected).toBe(true);
    });

    it("should reject the rejected value", async () => {
      const promiseDuration = 300;
      const awaitDuration = 500;

      const rejectedPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("rejected")), promiseDuration)
      );

      let error: unknown;
      awaitAtLeastOrReject(awaitDuration, rejectedPromise).catch(e => (error = e));

      await vi.advanceTimersByTimeAsync(300);
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("rejected");
    });
  });
});
