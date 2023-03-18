import { Command } from "../structures/Commands";
import { warns as warnings } from "../utils/warns";
import { EmbedBuilder } from "discord.js";

export default new Command({
  name: "warns",
  async run({ client, message, args }) {
    try {
      const user = await client.getMember("USER", message, args[0]);

      if (!user) return message.channel.send("You didn't mention any user");

      const warns = await warnings.findById(user.id);

      if (!warns || !warns.warns?.length)
        return message.channel.send("This user doesn't have any warn");

      const embed = new EmbedBuilder().setColor("Green");
      let str = "";
      warns.warns.forEach(({ author, reason, timestamp }, index) => {
        str += `**${
          index + 1
        }.** by <@${author}>${reason ? ` | Reason: ${reason}` : ""}${timestamp ? ` | Timestamp: <t:${timestamp}:F>` : ""}\n`;
      });

      embed.setDescription(str);

      message.channel.send({ embeds: [embed] });
 
      return;
    } catch {
      return message.channel.send("Error!");
    }
  },
});