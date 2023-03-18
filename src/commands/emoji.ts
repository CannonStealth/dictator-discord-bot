import {Command} from "../structures/Commands"

export default new Command({
  name: "emoji",
  permissions: "ManageEmojisAndStickers",
  run({ args, message, client }) {

      if (!message.guild) return
      if (args.length < 2) return message.channel.send(`Usage: <name> <url>`)

      message.guild.emojis.create({ name: args[0], attachment: args[1] })
      .then(() => message.delete())

      return
  },
}); 