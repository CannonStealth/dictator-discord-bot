import { Command } from "../structures/Commands";
import { warns as warnings } from "../utils/warns";
import { EmbedBuilder } from "discord.js";

export default new Command({
    name: "history",
    async run({ client, message, args }) {

        try {
        const user = await client.getMember("USER", message, args[0]) || message.author
    
        const warns = await warnings.find({ "warns.author": user.id })

        if (!warns?.length) return message.channel.send("This user hasn't warned anyone")

        let txt = ""
        for (const warn of warns) {
            const filteredWarn = warn.warns.filter((warn) => warn.author === user.id)
            if (!filteredWarn.length) continue
            
            for (const { reason, timestamp } of filteredWarn) txt += `Warned <@${warn._id}>${reason ? ` | Reason: ${reason}` : ""}${timestamp ? ` | Timestamp: <t:${timestamp}:F>` : ""}\n`
        }
 
        if (!txt) return message.channel.send("This user hasn't warned anyone")

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(txt)
   
        return message.channel.send({ embeds: [embed]})

        } catch {
            return message.channel.send("Error!")
        }
    }
})