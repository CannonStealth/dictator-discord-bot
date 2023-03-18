import { EmbedBuilder } from "discord.js";
import Event from "../structures/Event";

export default new Event({
  name: "guildMemberAdd",
  async run(client, member) {

    const embed = new EmbedBuilder()
    .setColor("Random")
    .setDescription(`Hey! ${member}, <@&1041823215632257124> to **${member.guild.name}**! Check out <#992882798262227054> and express yourself more with roles from <#993379385400901673>.\nDon't forget to introduce yourself in <#1038897811221118986>`)
    .setImage("https://cdn.discordapp.com/attachments/1019630116265001052/1019630130743738408/unknown-191.png")

    if (client.welcomeChannel) client.welcomeChannel.send({ content: `${member},`, embeds: [embed] })
  }
});
