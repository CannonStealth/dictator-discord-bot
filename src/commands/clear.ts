import {Command} from "../structures/Commands"

export default new Command({
  name: "clear",
  permissions: "Administrator",
  async run({ args, message, client }) {

    try {

    const member = await client.getMember("MEMBER", message, args[0])
    if (!member) return message.channel.send("Usage: -clear @user")

    const status = await (await client.database.ref(`AFK/${member.id}`).once("value")).val()?.afk
      if (!status) { 
        return message.channel.send("This user isn't AFK")
     } else {
        await client.database.ref(`AFK/${member.id}`).remove()
        message.react("✅")
        return
     }

    } catch {
        return message.channel.send("Error")
    }
    return
  },
}); 