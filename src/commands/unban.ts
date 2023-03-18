import {Command} from "../structures/Commands"

export default new Command({
  name: "unban",
  permissions: ["BanMembers"] ,
  async run({ args: [args, ...reason], message, client }) {

      const user = await client.getMember("USER", message, args)

      if (!user) return message.channel.send("You didn't send any user id")

      const ban = message.guild?.bans.fetch(user.id)
      if (!ban) return message.channel.send("That user is not banned")

      try {
        await message.guild?.bans.remove(user.id, `Unbanned by ${message.author.tag}`)
        message.react("✅")

      } catch {
        message.react("❌")
      }

    return
  },
}); 