import { Command } from "../structures/Commands";
import { warn } from "../utils/warns";
import { TextChannel } from "discord.js";

export default new Command({
    name: "warn",
    permissions: ["ModerateMembers"],
    async run({ client, message, args }) {

        try {
        const user = await client.getMember("MEMBER", message, args[0])
        if (user?.user.bot) return message.channel.send("You can't warn a bot")
        if (!user) return message.channel.send("You didn't mention anyone")

        if (message.member!.roles.highest.rawPosition <= user.roles.highest.rawPosition) return message.channel.send("You don't have power over this user")


        await message.channel.send(`Successfully warned <@${user.id}>`)
        await warn(user, message.author, args.slice(1)?.join(" "), client, message.channel as TextChannel)

        return

        } catch {
            return message.channel.send("Error!")
        }
    }
}) 