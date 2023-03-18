import { Command } from "../structures/Commands";

export default new Command({
    name: "bump",
    run({ message }) {
        if (message.channelId !== "1004038553187127366") return message.channel.send("Use in <#1004038553187127366>")
        return message.channel.send
        (`https://discadia.com/server/bot-dev/\nhttps://discords.com/servers/lattenight\nhttps://top.gg/servers/989940443087273985\nhttps://discord.me/lattenight\nhttps://disforge.com/server/69139-latte-night`)
    }
})  