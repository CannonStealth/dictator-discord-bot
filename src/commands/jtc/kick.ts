import { Command } from "../../structures/Commands";
import { GuildMember } from "discord.js";

export default new Command({
  name: "yeet",
  async run({ client, message }) {
    if (!message.member) return;
    const member = message.mentions.members?.first();
    if (!member) return message.channel.send("You didn't mention anyone");

    if (!message.member.voice.channel)
      return message.reply({ content: "You aren't in a voice channel" });

    if (!message.member.voice.channel.name.startsWith("『💫』"))
      return message.reply({
        content: "You aren't in a join to create channel",
      });

    if (
      !member.voice.channel ||
      member.voice.channelId !== message.member.voice.channelId
    )
      return message.reply({
        content: `This user isn't in the same voice chat as you`,
      });

    const ownerId = (
      await client.database
        .ref(`Voice/${message.member.voice.channelId}`)
        .once("value")
    ).val()?.owner;

    if (ownerId !== message.member.id)
      return message.reply({
        content: `Only <@${ownerId}> can kick people in this chat`,
      });
 
    await member.voice.disconnect();

    message.reply({ content: "Successfully yeeted that peasant" });
    client.vclogs?.send(`<@${member.id}> got yeeted from <#${member.voice.channel.id}>`)

    return;
  },
});
 