import {
  Client,
  Collection,
  Message,
  User,
  Snowflake,
  GuildMember,
  TextChannel,
  Partials,
  ActivityType,
  GatewayIntentBits,
} from "discord.js";
import { join } from "path";
import { readdir, lstat } from "fs/promises";
import { Command, Slash } from "./Commands";
import Event from "./Event";
import mongoose from "mongoose";
import { mongo } from "../config.json";
import firebase from "firebase";
import updateLeaderboard, { resetLeaderboard } from "../utils/leaderboard";
import { removeWarns } from "../utils/warns";
import { CronJob } from "cron";
import { firebase as firebaseConfig } from "../config.json";
const chatbot = require("discord-chatbot"); // package doesn't have the right typings

export default class WashingMachine extends Client {
  chatbot: any; // Package doesn't have the right typings
  database!: firebase.database.Database;
  dir: string;
  commands: Collection<string, Command>;
  slash: Collection<string, Slash>;
  prefix: string;
  welcomeChannel!: TextChannel;
  approvalChannel!: TextChannel;
  suggestionsChannel!: TextChannel;
  deleteChannel!: TextChannel;
  leaderboardMessage?: Message;
  leaderboardChannel?: TextChannel;
  spam: Collection<
    string,
    {
      infractions: number;
      time: number;
      stop?: boolean;
      stopped?: boolean;
    }
  >;
  vclogs?: TextChannel;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.dir = __dirname;
    this.commands = new Collection();
    this.slash = new Collection();
    this.spam = new Collection();
    this.prefix = "-";

    this.on("ready", async () => {
      console.log("Client is online");

      const chatbot = require("discord-chatbot");

      this.chatbot = new chatbot({
        name: this.user?.username,
        gender: "Male",
      });
      mongoose
        .connect(mongo, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
          keepAlive: true,
        })
        .then(() => console.log(`Connected to MongoDB`))
        .catch(console.error);

      firebase.initializeApp(firebaseConfig);

      firebase
        .auth()
        .signInAnonymously()
        .then(() => {
          console.log("Connected to Firebase");
        })
        .catch(console.error);

      this.database = firebase.database();

      this.welcomeChannel = (await this.channels.fetch(
        "989940443603148882"
      )) as TextChannel;
      this.deleteChannel = (await this.channels.fetch(
        "998680721923244052"
      )) as TextChannel;
      this.approvalChannel = (await this.channels.fetch(
        "1019698729885909042"
      )) as TextChannel;
      this.suggestionsChannel = (await this.channels.fetch(
        "1014679356276220005"
      )) as TextChannel;
      this.vclogs = (await this.channels.fetch(
        "1035551067506737152"
      )) as TextChannel;
      this.leaderboardChannel = (await this.channels.fetch(
        "999442414290874438"
      )) as TextChannel;
      this.leaderboardMessage = (
        await this.leaderboardChannel.messages.fetch({ limit: 1 })
      ).first() as Message;

      console.log("Everything is loading");

      this.loader<Command>(this.dir, "../commands", (cmd) => {
        this.commands.set(cmd.name.toLowerCase(), cmd);

        console.log(`Loading command ${cmd.name}`);
      });

      this.loader<Event>(this.dir, "../events", (event) => {
        this.on(event.name, event.run.bind(undefined, this));

        console.log(`Loading event ${event.name}`);
      });

      this.loader<Slash>(this.dir, "../slash", (slash) => {
        this.slash.set(slash.name.toLowerCase(), slash);

        console.log(`Loading slash ${slash.name}`);
      });

      this.user?.setPresence({
        status: "dnd",
        activities: [
          {
            type: ActivityType.Watching,
            name: "Ykk is a fooking genius",
          },
        ],
      });

      /* setInterval(() => {
        this.welcomeChannel.send("Hello World!")
      }, 1000 * 60 * 60) */
      setInterval(() => {
        updateLeaderboard(this);
        removeWarns();
      }, 1000 * 30);
    });

    const bot = this;

    new CronJob(
      "0 0 0 * * Mon",
      function () {
        resetLeaderboard(bot);
      },
      null,
      true,
      "America/Los_Angeles"
    );
  }

  private async loader<T>(
    _: string,
    dir: string,
    callback?: (command: T) => unknown
  ) {
    const files = await readdir(join(_, dir));
    for (const file of files) {
      const stat = await lstat(join(_, dir, file));
      if (stat.isDirectory()) {
        this.loader(_, join(dir, file), callback);
        continue;
      } else if (
        !file.endsWith(".js") &&
        (!file.endsWith(".ts") || file.endsWith(".d.ts"))
      )
        continue;

      const command = (await import(join(_, dir, file))).default;

      if (callback) callback!(command);
    }
  }

  public async getMember<T extends "USER" | "MEMBER">(
    type: T,
    message: Message,
    id?: Snowflake
  ): Promise<
    | undefined
    | (T extends "USER"
        ? User | undefined
        : T extends "MEMBER"
        ? GuildMember | undefined
        : never)
  > {
    try {
      if (type === "USER")
        return (message.mentions.users.first() ||
          (id ? this.users.fetch(id) : undefined)) as T extends "USER"
          ? User | undefined
          : T extends "MEMBER"
          ? GuildMember | undefined
          : never;
      else if (type === "MEMBER")
        return (message.mentions.members?.first() ||
          (id
            ? message.guild?.members.fetch(id)
            : undefined)) as T extends "USER"
          ? User | undefined
          : T extends "MEMBER"
          ? GuildMember | undefined
          : never;

      return;
    } catch {
      return;
    }
  }

  public async ban(user: GuildMember, channel: TextChannel) {
    const msg = await this.approvalChannel.send(
      `Ban request: <@${user.id}> - ${user.id} - ${user.displayName} - ${user.user.tag}\n\nReact with \\✅ if you agree to ban this user\nDelete this message if no one approves this ban`
    );
    msg.react("✅");

    channel.send(`<@${user.id}> is now stuck in a ban request`);
    user.timeout(1000 * 60 * 60 * 24 * 20);
  }
}
