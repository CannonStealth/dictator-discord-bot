import {Command} from "../structures/Commands"

export default new Command({
  name: "points",
  async run({ args, message, client }) {

    const user = await client.getMember("USER", message, args[0]) || message.author

    let xp = (await client.database.ref(`Levels/${user.id}`).once("value")).val()?.xp
    if (!xp) xp = 0

    return message.channel.send(`<@${user.id}> has ${xp} points`)
  },
}); 