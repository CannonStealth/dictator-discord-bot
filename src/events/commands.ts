import { ChannelType } from "discord.js";
import Event from "../structures/Event";

export default new Event({
    name: "messageCreate",
    run(client, message) {

        if (message.channel.type !== ChannelType.GuildText) return 
        if (message.author.bot) return 
        if (!message.content.startsWith(client.prefix)) return 

        const args = message.content.split(/[ ]+/g)

        const commandName = args.shift()?.slice(client.prefix.length)?.toLowerCase()

        if (!commandName) return
        const cmd = client.commands.get(commandName)

        if (!cmd) return 

        if (cmd.permissions && !message.member?.permissions.has(cmd.permissions)) return message.channel.send("You can't execute this command!")

        cmd.run({ message, client, args })

        return
    }
}) 