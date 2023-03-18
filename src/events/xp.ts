import { GuildMember } from "discord.js";
import WashingMachine from "../structures/Client";
import Event from "../structures/Event";
export default new Event({
  name: "messageCreate",
  async run(client, message) {
    if (!message.member ||
      message.author.bot ||
      message.channel.type === 1 ||
      !message.content ||
      message.channelId === "992909239376957471" ||
      message.content.length > 200
    ) return; // spam channel

    if (message.member.permissions.has(["ModerateMembers"])) return
    else xp(
      client,
      message.member,
      Math.floor(Math.random() * (message.content.length / 1.2))
    );
  },
});

export async function xp(client: WashingMachine, user: GuildMember, amount: number) {

  let xp = (await client.database.ref(`Levels/${user.id}`).once("value")).val()
    ?.xp;

  if (!xp)
    return client.database.ref(`Levels/${user.id}`).set({
      xp: amount,
    });

  xp = xp + amount;

  client.database.ref(`Levels/${user.id}`).update({
    xp,
  });
}
 