import { wait } from "./wait";

/**
 * Makes sure that the given promise takes at least the given amount of time to resolve but will reject as soon as possible.
 *
 * This function is useful for creating consistent user experiences, such as showing loading indicators
 * for a minimum duration to avoid UI flashes.
 *
 * If the promise resolves before the given amount of time is up, the function will wait for the remaining
 * time before returning the result.
 *
 * If the promise rejects before the given amount of time is up, the function will reject immediately.
 *
 * @param ms The minimum amount of time the promise should take to resolve in milliseconds.
 * @param promise The promise to await.
 * @returns A promise that resolves to the same type as the input promise.
 *
 * @example
 * ```ts
 * import { awaitAtLeast } from "await-at-least";
 *
 * const postToServer = async (url: string, body: unknown) => {
 *   // ...
 * };
 *
 * const responseFromServer = await awaitAtLeastOrReject(800, postToServer("https://api.example.com", requestBody));
 * ```
 */
export const awaitAtLeastOrReject = async <T>(ms: number, promise: Promise<T>): Promise<T> => {
  const atLeastPromise = wait(ms);

  try {
    const [result] = await Promise.all([promise, atLeastPromise]);
    return result;
  } catch (error) {
    throw error;
  }
};
