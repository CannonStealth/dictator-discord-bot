import {
  Message,
  PermissionResolvable,
  ApplicationCommandOptionData,
  GuildMember,
  CommandInteraction,
  Guild,
  User,
} from "discord.js";
import WashingMachine from "./Client";
import client from "../index"

export interface Command {
  name: string;
  permissions?: PermissionResolvable;
  run: (options: { message: Message, client: WashingMachine, args: string[] }) => unknown | void;
}


export class Command {
  constructor(options: Command) {
      Object.assign(this, options)
  }
}

export class Slash {
  name;
  permissions;
  options;
  run;

  constructor(properties: SlashOptions) {
    this.name = properties.name;
    this.run = properties.run;
    this.permissions = properties.permissions

    this.options = {
      name: properties.name,
      description: properties.description,
      defaultPermission: properties.default === false ? false : true,
      options: properties.options,
    };
  }

  public submit() {
    const app = client.application;
    if (!app) throw new Error("Client isn't logged in");
    app.commands.create(this.options,);
    return this;
  }
}

export interface SlashOptions {
  name: string;
  description: string;
  permissions?: PermissionResolvable;
  default?: boolean;
  options?: Array<ApplicationCommandOptionData>;
  run: (params: {
    client: WashingMachine;
    interaction: CommandInteraction;
    guild: Guild;
    member: GuildMember;
    user: User;
  }) => unknown;
}
 