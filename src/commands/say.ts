import { Command } from "../structures/Commands";
import { TextChannel } from "discord.js";

export default new Command({
  name: "say",
  permissions: "Administrator",
  run({ message, client, args }) {
    message.delete();
    let text = args.join(" ");
    if (!text) return message.reply("No content??");

    const channel = message.mentions.channels.first();

    if (channel && channel instanceof TextChannel) {
      return channel.send(text.replace(channel.toString(), ""));
    }

    return message.channel.send(text);
  },
});
 