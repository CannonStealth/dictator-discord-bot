import {Command} from "../structures/Commands";
import { time } from "../utils/time";
export default new Command({
  name: "mute",
  permissions: "ModerateMembers",
  async run({ message, args, client }) {

    try {
    if (!message.guild?.client || !message.member) return;

    const member = await client.getMember("MEMBER", message, args[0]);

    if (!member) return message.channel.send("You didn't provide any member");

    const me = await message.guild.members.fetch(client.user!.id)
    if (
      me.roles.highest.rawPosition <
      member.roles.highest.rawPosition
    )
      return message.channel.send("I can't mute this user");
      if (message.member!.roles.highest.rawPosition <= member.roles.highest.rawPosition) return message.channel.send("You don't have power over this user")

     const expiration = time(args.slice(1).join(" "));

    if (!expiration)
      return message.channel.send(
        "Invalid expiration time;\nFormat example: **2d 12h 30m 20s**"
      );

    if (expiration <= 9999)
      return message.channel.send("Duration can not be less than 10 seconds"); // Return when its less than 10 seconds.
    if (expiration > 2332800000)
      return message.channel.send("Duration can not be more than 27 days"); // Return when its over 27 days.

    await member.timeout(expiration)

    message.channel.send(`Successfully muted <@${member.id}>`);

    return;

      } catch {
          return
      }
  },
}); 