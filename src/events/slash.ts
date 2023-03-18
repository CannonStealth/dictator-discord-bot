import Event from "../structures/Event";

export default new Event({
  name: "interactionCreate",
  async run(client, interaction) {
    if ((!interaction.inGuild() && interaction.isCommand()) || !interaction.isChatInputCommand()) return;

    const user = interaction.user;
    const guild = interaction.guild;

    if (interaction.isCommand() && guild) {
      const member = await guild.members.fetch(user)
      if (!member) return
      const cmd = client.slash.get(interaction.commandName.toLowerCase());

      if (!cmd) return;
      if (cmd.permissions && !member?.permissions.has(cmd.permissions)) return interaction.reply({ content: "You can't execute this command!", ephemeral: true });
      cmd.run({ client, interaction, guild, member, user });
      return;
    }

    return;
  },
});
