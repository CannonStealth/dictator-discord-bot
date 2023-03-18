import { ApplicationCommandOptionType } from "discord.js";
import { Slash } from "../structures/Commands"

export default new Slash({
  name: "afk",
  description: "Sets your afk status",
  options: [{
    name: "text",
    max_length: 60,
    required: false,
    description: "Text displayed when someone mentions you",
    type: ApplicationCommandOptionType.String,
  }],
  async run({ interaction, user, client }) {

    try {
     
    const status = await (await client.database.ref(`AFK/${user.id}`).once("value")).val()?.afk
      if (!status) { 
        const afk = interaction.options.get("text")?.value || "AFK"
        await client.database.ref(`AFK/${user.id}`).set({
        afk,
        time: interaction.createdTimestamp
      })
      interaction.reply({ content: `AFK Status set: ${afk}`, allowedMentions: { parse: [] }})
     } else return

    } catch {
        return interaction.reply({ content: "Error", ephemeral: true })
    }
    return
  },
})