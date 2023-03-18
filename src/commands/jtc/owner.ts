import { Command } from "../../structures/Commands";

export default new Command({
  name: "owner",

  async run({ client, message }) {

    if (!message.member) return;
    const ownerWannaBe = message.mentions.members?.first();
    if (!ownerWannaBe) return message.channel.send("You didn't mention anyone");

    if (!message.member.voice.channel) return message.reply({ content: "You aren't in a voice channel" });

    if (!message.member.voice.channel.name.startsWith("『💫』")) return message.reply({ content: "You aren't in the channel" });

    if (ownerWannaBe.user.bot) return message.reply({ content: "You can't make a bot owner" })

    if (!ownerWannaBe.voice.channel?.name.startsWith("『💫』")) return message.reply({ content: "The user isn't in the channel" });

    if (ownerWannaBe.voice.channelId !== message.member.voice.channelId) return message.reply({ content: `You aren't in the same voice channel as <@${ownerWannaBe.id}>` });

    const ownerId = (await client.database.ref(`Voice/${message.member.voice.channelId}`).once("value")).val()?.owner

    if (ownerId !== message.member.id) return message.reply({ content: `Only <@${ownerId}> can change the ownership of this channel` });

    await client.database.ref(`Voice/${message.member.voice.channelId}`).update({
        owner: ownerWannaBe.id
    });

    await message.member.voice.channel.edit({
        permissionOverwrites: [
            {
                id: "1000094325625061436",
                deny: "ViewChannel"
              },
            {
                id: ownerId,
                deny: "Connect"
            },
            {
                id: ownerWannaBe.id,
                allow: "Connect"
            }
        ]
    })

    message.reply({ content: `<@${ownerWannaBe.id}> is the new owner` })
    client.vclogs?.send(`${ownerWannaBe.voice.channel.id}> has now a new owner (<@${ownerWannaBe.id}>)`)
 
    return
 },
})