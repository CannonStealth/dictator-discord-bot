import Event from "../structures/Event";
import { EmbedBuilder, TextChannel, UserFlags } from "discord.js";
import { warn } from "../utils/warns";
import convert from "../utils/time";
const warnsMap = new Map();

export default new Event({
  name: "messageCreate",
  async run(client, message) {

    (async () => {
    if (
      message.author.bot ||
      message.channel.type === 1 ||
      !message.guild ||
      !message.member || message.member.permissions.has("Administrator") || message.channelId === "992909239376957471"
    )
      return;


    const time = 5000;
    const limit = 5;

    if (client.spam.has(message.author.id)) {
      const data = client.spam.get(message.author.id)!;

      if (!data.stop) {
        if (message.createdTimestamp - data.time < time) {
          if (data.infractions > limit) {
            const msg = await message.channel.send(
              `**STOP SPAMMING**\nYou have 5 seconds to stop`
            );

            const amount = warnsMap.get(message.author.id);
            warnsMap.set(
              message.author.id,
              amount !== undefined ? amount + 1 : 1
            );
            console.log(amount)
            if (amount && amount >= 4) {
              warn(
                message.member,
                message.author,
                "spamming",
                client,
                message.channel as TextChannel,
                Date.now() + 1000 * 60 * 10
              );

              msg.reply("You got 1 warn for this");
            }
            data.stop = true;
          } else {
            data.infractions++;
          }
        } else {
          client.spam.delete(message.author.id);
        }
      } else if (!data.stopped) {
        data.stopped = true;
        setTimeout(() => client.spam.delete(message.author.id), 5000);
      }
    } else {
      client.spam.set(message.author.id, {
        infractions: 1,
        time: message.createdTimestamp,
      });
    }
  })();

  (async () => {
    if (message.author.bot || message.channel.type === 1) return
    const status = await (await client.database.ref(`AFK/${message.author.id}`).once("value")).val()?.afk
    
    if (status) {
      await client.database.ref(`AFK/${message.author.id}`).remove()
      message.channel.send(`Welcome back <@${message.author.id}>, I removed your AFK Status`)
    }

    const users = Array.from(message.mentions.users.values())

    for (const { id } of users) {
      const afk = await (await client.database.ref(`AFK/${id}`).once("value")).val()
      if (afk?.afk) return message.channel.send({ content: `<@${id}> is AFK: ${afk.afk} - ${convert(message.createdTimestamp - afk?.time, 2)} ago`, allowedMentions: { parse: [] }})
    }

    return
  })();

  (async () => {
    if (message.author.bot || message.channelId !== "1014679356276220005" || !message.content) return 

    message.delete()
    const embed = new EmbedBuilder()
    .setColor("Yellow")
    .setAuthor({ 
      iconURL: message.author.displayAvatarURL(), 
      name: `${message.author.tag}'s Suggestion`
    })
    .setDescription(message.content.slice(0, 2000))
    .setFooter({ text: "Want to suggest something? Type it in this channel!" })

    client.suggestionsChannel?.send({ embeds: [embed] })
  })();

  (() => {
    if (!message.content || message.channelId !== "1020685598236885063" || message.author.bot) return
    client.chatbot.chat(message.content).then((response: any) => message.channel.send(response))
  })()
  },
});
