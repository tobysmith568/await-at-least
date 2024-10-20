# await-at-least

A small set of functions to await at least a certain amount of time before resolving a promise.

<a href="https://www.npmjs.com/package/await-at-least">
  <img alt="npm" src="https://img.shields.io/npm/v/await-at-least?logo=npm">
</a>

<a href="https://license-cop.js.org">
  <img alt="Protected by: License-Cop" src="https://license-cop.js.org/shield.svg">
</a>

## Installation

```pwsh
npm install await-at-least
```

## Usage

### awaitAtLeast

Wraps the given promise and makes sure it takes at least the given duration before it resolves or rejects.

```ts
import { awaitAtLeast } from "await-at-least";

const postToServer = async (url: string, body: unknown) => {
  // ...
};

const responseFromServer = await awaitAtLeast(
  800,
  postToServer("https://api.example.com", requestBody)
);
```

If the given promise resolves before the given amount of time is up, the returned promise will wait for the remaining time before returning the result.

If the given promise rejects before the given amount of time is up, the returned promise will wait for the remaining time before rethrowing the error.

### awaitAtLeastOrReject

Wraps the given promise and makes sure it takes at least the given duration before it resolves but will reject as soon as the wrapped promise rejects.

```ts
import { awaitAtLeastOrReject } from "await-at-least";

const postToServer = async (url: string, body: unknown) => {
  // ...
};

const responseFromServer = await awaitAtLeastOrReject(
  800,
  postToServer("https://api.example.com", requestBody)
);
```

If the given promise resolves before the given amount of time is up, the returned promise will wait for the remaining time before returning the result.

If the given promise rejects before the given amount of time is up, the returned promise will reject immediately.

## License

await-at-least is licensed under the [ISC license](./LICENSE.md).
