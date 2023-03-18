import Client from "../structures/Client"
import topTen from "./topTen"
import { GuildMember } from "discord.js"
export default async function updateLeaderboard(client: Client) {
    const top = Object.entries((await client.database.ref(`Levels`).once("value")).val()).map(([ id, { xp }]: any) => [id, xp]).sort((a, b) => -a[1] + b[1]).slice(0, 5)
  
    let msg = "**Leaderboard** of this week\n"
    let num = 1
  
    for (const [id, xp] of top) {
      msg += `\n**${num}.** <@${id}> with **${xp}** points`
      num++
    }
  
    msg += "\n\nThis is updated every 30 seconds"
  
    client.leaderboardMessage?.edit(msg)
  }


export async function resetLeaderboard(client: Client) {
  // 1019920993814315049

  if (!client.leaderboardMessage) return false; 
  const content = Array.from(client.leaderboardMessage.mentions.members!.values())
  await client.database.ref('Levels').set(null) // resetting leaderboard

  const olds = (await topTen.findById("1019920993814315049"))?.users;

  if (olds?.length) {
  await topTen.findByIdAndDelete("1019920993814315049") // deleting members from database
  
  olds.forEach(async (old, i) => {

    setTimeout(async () => {
    const member = await client.leaderboardMessage?.guild?.members.fetch(old)
    if (member) member.roles.remove("1019920993814315049")

    if (i + 1 === olds.length) keepGoing(content)
    }, i * 10000)


  })

  }

  return
 
}

async function keepGoing(content: GuildMember[]) {
  await topTen.findByIdAndDelete("1019920993814315049")

  const ids = content.map((member, i) => {

    if (!member) return 
    setTimeout(() => member.roles.add("1019920993814315049"), i * 10000);

    return member.id 
  }).filter(id => typeof id === "string") as string[]

  if (ids && ids.length) await topTen.findByIdAndUpdate("1019920993814315049", {
    users: ids
  }, { upsert: true })

  return;
}
