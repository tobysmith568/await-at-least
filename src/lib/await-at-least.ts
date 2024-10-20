import { wait } from "./wait";

/**
 * Wraps the given promise and makes sure it takes at least the given duration before it resolves or rejects.
 *
 * This function is useful for creating consistent user experiences, such as showing loading indicators
 * for a minimum duration to avoid UI flashes.
 *
 * If the given promise resolves before the given amount of time is up, the returned promise will wait
 * for the remaining time before returning the result.
 *
 * If the given promise rejects before the given amount of time is up, the returned promise will wait
 * for the remaining time before rethrowing the error.
 *
 * @param ms The minimum amount of time the promise should take to resolve or reject in milliseconds.
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
 * const responseFromServer = await awaitAtLeast(800, postToServer("https://api.example.com", requestBody));
 * ```
 */
export const awaitAtLeast = async <T>(ms: number, promise: Promise<T>): Promise<T> => {
  const atLeastPromise = wait(ms);

  try {
    const [result] = await Promise.all([promise, atLeastPromise]);
    return result;
  } catch (error) {
    await atLeastPromise;
    throw error;
  }
};
