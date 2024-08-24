// import { Agent } from 'undici'
import { createProxy } from "node-fetch-native/proxy";

const fetch = globalThis.fetch
globalThis.fetch = function (input: RequestInfo | URL, init?: RequestInit | undefined | any) {
  if (!init) {init = {}}
  init = {
    ...createProxy(),
    ...init,
    // dispatcher: new Agent({
    //   connect: { timeout: 600000 },
    //   // keepAliveTimeout: 20000,
    //   // keepAliveMaxTimeout: 20000,
    // }),
  }
  return fetch(input, init)
}
