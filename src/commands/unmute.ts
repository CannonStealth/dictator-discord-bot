
import {Command} from "../structures/Commands";

export default new Command({
  name: "unmute",
  permissions: "ModerateMembers",
  async run({ args, message, client }) {
    try {
      if (!message.member || !message.guild) return;
      const user = await client.getMember("MEMBER", message, args[0]);

      if (!user) return message.channel.send("You didn't mention anyone");

      const me = await message.guild.members.fetch(client.user!.id)
      if (
        me.roles.highest.rawPosition <
        user.roles.highest.rawPosition
      )
        return message.channel.send("I can't unmute this user");
      if (message.member!.roles.highest.rawPosition <= user.roles.highest.rawPosition) return message.channel.send("You don't have power over this user")

      const reason = args.slice(1).join(" ") || "No reason specified";
      user.timeout(null)

      message.channel.send(`Successfully unmuted <@${user.id}>`);

      return;
    } catch {
      return message.channel.send("Couldn't unmute that user");
    }
  },
}); 