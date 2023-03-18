import { Command } from "../structures/Commands";

export default new Command({
  name: "unblock",
  permissions: "ModerateMembers",
  async run({ args, message, client }) {

    const member = await client.getMember("MEMBER", message, args[0]);

    try {
      if (member) {
        if (
          message.member!.roles.highest.rawPosition <=
          member.roles.highest.rawPosition
        )
          return message.channel.send("You don't have power over this user");

        if (!member.roles.cache.has("1000094325625061436"))
          return message.channel.send("This user isn't blocked");

        await member.roles.remove("1000094325625061436");
        message.channel.send(`Successfully unblocked <@${member.id}>`);
      } else {
        message.channel.send("You didn't mention anyone");
      }
    } catch {
      return message.channel.send("Error!");
    }

    return;
  }, 
});
