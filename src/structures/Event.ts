import { ClientEvents } from "discord.js";
import Client from "./Client";

interface Event<
  T extends keyof (ClientEvents & {
    active: never;
  }) = any
> {
  name: T;
  run: (
    client: Client,
    ...EventOptions: (ClientEvents & {
      active: never;
    })[T]
  ) => any;
}

class Event<T> {
  constructor(options: Event<T>) {
    Object.assign(this, options);
  }
}

export default Event;
 