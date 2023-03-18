import { Message, Client, EmbedBuilder } from "discord.js";
import * as util from "util";
import { Command } from "../structures/Commands";
const x = "```";

export default new Command({
  name: "eval",
  async run({ message, client, args }) {

    if (message.author.id !== "811657485462274129") return message.reply({ content: "You can't execute this command" })
    let text = args.join(" ");
    let secret: EmbedBuilder | Message = new EmbedBuilder()
      .setTitle("Processing...")
      .setColor("Orange");

    secret = await message.channel.send({ embeds: [secret] });

    try {
 

      let toEval: any = eval(text.replace(/```/g, ""));
      if (typeof toEval !== "string")
        toEval = resume(util.inspect(toEval, { depth: 0 }), 750);

      const embed = new EmbedBuilder()
        .addFields([
          { name: "To eval:", value: x + text + x, inline: false },
          { name: "\\📤 Output:", value: x + resume(toEval, 750) + x, inline: false },
          { name: "Type", value: x + typeof toEval + x, inline: false }
        ])
        .setColor("#000dff");

      secret.edit({ embeds: [embed] });
    } catch (err) {
      const errEmbed = new EmbedBuilder()
        .setTitle("Error")
        .addFields([{ name: "\\📤 Output:", value: x + resume(err as string, 750) + x, inline: false }])
        .setColor("Red");

      return secret.edit({ embeds: [errEmbed] });
    }
    return;
  },
});

function resume(text: string, number: number) {
  let str = "";
  if (text.length > number) {
    str += text.substring(0, number);
    str += "...";
    return str;
  } else {
    str += text;
    return str;
  }
}
