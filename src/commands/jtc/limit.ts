import { Command } from "../../structures/Commands";

export default new Command({
  name: "limit",

  async run({ args, message, client }) {

    if (!message.member || !message.guild) return;
    if (!args[0]) return message.channel.send("Usage: -limit <number / off>")

    if (!message.member.voice.channel)
      return message.reply({ content: "You aren't in a voice channel" });

    if (!message.member.voice.channel.name.startsWith("『💫』"))
      return message.reply({
        content: "You aren't in a join to create channel",
      });

      const ownerId = (
        await client.database
          .ref(`Voice/${message.member.voice.channelId}`)
          .once("value")
      ).val()?.owner;
  
      if (ownerId !== message.member.id)
        return message.reply({
          content: `Only <@${ownerId}> can change the user limit`,
        });
  

    if (args[0].toLowerCase() === "off") {
        message.member.voice.channel.edit({
            userLimit: 0,
        })

        message.react("✅")
        return
    } 

    const num = parseInt(args[0])
    if (isNaN(num)) return message.channel.send("That's not a number")

    if (num < 1) return message.channel.send("The number can't be lower than 1")
    if (num > 99) return message.channel.send("The number can't be higher than 99")
    if (num === 69) message.channel.send("You're not funny tho")


    message.member.voice.channel.edit({
        userLimit: num
    })
 
    message.react("✅")
    return
 },
}) 