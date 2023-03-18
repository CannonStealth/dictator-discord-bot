import Event from "../structures/Event"

export default new Event({
    name: "messageReactionAdd",
    async run(client, reaction, user) {

        if (reaction.message.channelId === client.approvalChannel.id && reaction.emoji.name === "✅" && !user.bot && reaction.message.author?.id === client.user?.id) {
            const id = reaction.message.content?.split("-")[1].trim()

            if (!id) return
            await reaction.message.guild?.bans.create(id)
            await reaction.message.reactions.removeAll()
            setTimeout(() => reaction.message.delete(), 2000)

        }       
    }
}) 