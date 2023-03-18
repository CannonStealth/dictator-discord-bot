import { Command } from "../structures/Commands";
import { resetLeaderboard } from "../utils/leaderboard";

export default new Command({
    name: "reset",
    permissions: "Administrator",
    async run({ client, message, args }) {

        try {
            if (!args[0]) return message.channel.send("Usage: -reset @user / all")
            if (args[0]?.toLocaleLowerCase() === "all") {
            const val = await resetLeaderboard(client)
            if (val === false) return message.react("❌")
            // Removes everything
            await message.react("✅")
            return
            } else {
                const member = await client.getMember("USER", message, args[0]) 
                if (!member) return message.channel.send("Usage: -reset @user / all")

                await client.database.ref(`Levels/${member.id}`).remove()
                await message.react("✅")
                return
            }
        } catch {
            return message.channel.send("Error!")
        }
    }
}) 