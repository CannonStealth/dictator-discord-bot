import { Snowflake } from "discord.js";
import { Command } from "../structures/Commands";

const cooldowns = new Map<Snowflake, number>()

export default new Command({
  name: "block",
  permissions: "ModerateMembers",
  async run({ args, message, client }) {

    const member = await client.getMember("MEMBER", message, args[0]);

    if (member) {

      if (message.member!.roles.highest.rawPosition <= member.roles.highest.rawPosition) return message.channel.send("You don't have power over this user")

      const cooldown = cooldowns.get(message.author.id)
      if (cooldown && cooldown > message.createdTimestamp) return message.channel.send("You cannot use this command right now")

      member.roles.add("1000094325625061436");
      message.channel.send(`Successfully blocked <@${member.id}>`);
      cooldowns.set(message.author.id, message.createdTimestamp + 1000 * 3600 * 5)
      
    } else {
      message.channel.send("You didn't mention anyone");
    }

    return;
  },
});
 