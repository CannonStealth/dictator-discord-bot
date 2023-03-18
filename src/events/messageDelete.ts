import { EmbedBuilder, TextChannel } from "discord.js";
import Event from "../structures/Event";

export default new Event({
    name: "messageDelete",
    async run(client, message) {

        const attachments = Array.from(message.attachments.values())

        if (message.author && (message.content || attachments.length) && message.channel instanceof TextChannel && !message.author.bot) {
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${message.author.tag} message was deleted in ${message.channel.name}`, iconURL: message.author.displayAvatarURL()})
            .setColor("Yellow")

            if (message.content) embed.setDescription(message.content)
            
            if (client.deleteChannel) { 
                await client.deleteChannel.send({ embeds: [embed] })
                if (attachments.length) await client.deleteChannel.send({ files: attachments })
            }
    }
}
})