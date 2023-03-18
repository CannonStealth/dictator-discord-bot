import { EmbedBuilder, TextChannel } from "discord.js";
import Event from "../structures/Event";

export default new Event({
    name: "messageUpdate",
    run(client, oldMessage, newMessage) {

        const url = oldMessage.attachments.first()?.url
        if (newMessage.author && newMessage.content && oldMessage.content && newMessage.channel instanceof TextChannel && oldMessage.content !== newMessage.content && !newMessage.author.bot) {
            const embed = new EmbedBuilder()
            .setAuthor({ name: `${newMessage.author.tag} edited a message in ${newMessage.channel.name}`, iconURL: newMessage.author.displayAvatarURL()})
            .setColor("Yellow")

            if (newMessage.content) embed.setDescription(`**Before:** ${oldMessage}\n**After:** ${newMessage}`)
            if (url) embed.setImage(url)

            if (client.deleteChannel) client.deleteChannel.send({ embeds: [embed] })
    }
}
})