import {Command} from "../structures/Commands"
import { EmbedBuilder } from "discord.js"

export default new Command({
  name: "help",
  async run({ message, client }) {

    const txt = client.commands.map((cmd) => `**${client.prefix + cmd.name}**`)
      const embed = new EmbedBuilder()
      .setAuthor({ name: `${client.user?.tag}'s commands list `, iconURL: client.user?.displayAvatarURL()})
      .setDescription(`${txt.join(";\n")}.`)
      .setColor("Random")

      message.channel.send({ embeds: [embed] })
  },
}); 