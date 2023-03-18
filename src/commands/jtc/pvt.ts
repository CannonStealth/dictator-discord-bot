import { Command } from "../../structures/Commands";

export default new Command({
  name: "pvt",
  async run({ client, message }) {

    try {
    if (!message.member || !message.guild) return;
    if (!message.member.voice.channel)
      return message.channel.send("You aren't in a voice chat");
    if (!message.member.voice.channel?.name.startsWith("『💫』"))
      return message.reply({ content: "You aren't in the right channel" });

    const ownerId = (
      await client.database
        .ref(`Voice/${message.member.voice.channelId}`)
        .once("value")
    ).val()?.owner;
 
    if (ownerId !== message.member.id)
      return message.reply({
        content: `Only <@${ownerId}> can turn this into a private call`,
      });

    await message.member.voice.channel.edit({
      permissionOverwrites: [
        {
          id: "1000094325625061436",
          deny: "ViewChannel"
        },
        {
          id: ownerId,
          allow: "Connect"
        },
        {
          id: message.guild?.id,
          deny: "Connect"
        },
      ],
    });

    message.react("✅");

    return;

} catch {
    message.react("❌")

    return;
}
  },
});
