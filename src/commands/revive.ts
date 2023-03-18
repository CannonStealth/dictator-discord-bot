import { Command } from "../structures/Commands"
const cooldowns = new Map()
import convert from "../utils/time";

const names = ["shits", "twats", "prats", "fuckwits", "peasants", "brats", "fucks", "pricks", "brats", ""]
export default new Command({
  name: "revive",
  async run({ args, message, client }) {
    
    if (!message.guild) return
    const time = cooldowns.get(message.guild.id)

    if (!message.member?.roles.cache.has("1039985931551256667")) return message.channel.send("You must have Reviver role in order to use this command, please get it in <#993379385400901673>")

    if (time > Date.now()) return message.channel.send(`Cooldown ends in ${convert(time - Date.now(), 3)}`);

    message.channel.send(`<@&1039985931551256667> **REVIVE THIS CHAT** you little ${names[Math.floor(Math.random() * names.length)]}`)
    cooldowns.set(message.guild.id, Date.now() + 1000 * 3600)
    return;
  },
}); 