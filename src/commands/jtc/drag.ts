import { Command } from "../../structures/Commands";

const id = "1019986192193814568";

export default new Command({
  name: "drag",
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

    if (member.user.bot)
      return message.reply({ content: "You can't invite a bot" });

    if (!member.voice.channel || member.voice.channelId !== id)
      return message.reply({ content: `This user isn't in <#${id}>` });
 
    const ownerId = (
      await client.database
        .ref(`Voice/${message.member.voice.channelId}`)
        .once("value")
    ).val()?.owner;
 
    if (ownerId !== message.member.id)
      return message.reply({
        content: `Only <@${ownerId}> can drag people into this chat`,
      });

    await member.voice.setChannel(message.member.voice.channel);

    message.reply({ content: "Enjoy" });
    client.vclogs?.send(`<@${member.id}> got dragged into <#${member.voice.channel.id}>`)
    return;
  },
});
