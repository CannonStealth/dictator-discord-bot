import {Command} from "../structures/Commands"

export default new Command({
  name: "kick",
  permissions: ["KickMembers"] ,
  async run({ args: [args, ...reason], message, client }) {

      const member = await client.getMember("MEMBER", message, args)

      if (!member) return message.channel.send("You didn't mention anyone to kick")
      if (message.member!.roles.highest.rawPosition <= member.roles.highest.rawPosition) return message.channel.send("You don't have power over this user")
      if (!member.kickable) return message.channel.send("I can't kick that member")


      try {
        await member.kick(reason ? reason.join(" ") : undefined)
        message.react("✅")

      } catch {
        message.react("❌")
      }

    return
  },
});