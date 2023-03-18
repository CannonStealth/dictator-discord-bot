import {Command} from "../structures/Commands"

export default new Command({
  name: "ban",
  permissions: ["BanMembers"] ,
  async run({ args: [args, ...reason], message, client }) {

      const member = await client.getMember("MEMBER", message, args)

      if (!member) return message.channel.send("You didn't mention anyone to ban")
      if (message.member!.roles.highest.rawPosition <= member.roles.highest.rawPosition) return message.channel.send("You don't have power over this user")
      if (!member.bannable) return message.channel.send("I can't ban that member")

      try {
        member.user.send(`You got banned from ${member.guild.name}`).catch(() => undefined)
        await member.ban({ reason: reason ? reason.join(" ") : undefined, deleteMessageSeconds: 0 })
        message.react("✅")

      } catch {
        message.react("❌")
      }

    return
  },
}); 