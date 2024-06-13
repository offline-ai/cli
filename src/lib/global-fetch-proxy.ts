import { createProxy } from "node-fetch-native/proxy";

const fetch = globalThis.fetch
globalThis.fetch = function (input: RequestInfo | URL, init?: RequestInit | undefined) {
  if (!init) {init = {}}
  init = {...createProxy(), ...init}
  return fetch(input, init)
}
