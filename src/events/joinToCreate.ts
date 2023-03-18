import { Collection, GuildChannel, VoiceState, GuildVoiceChannelResolvable, VoiceChannel, ChannelType } from "discord.js"
import Client from "../structures/Client";
import Event from "../structures/Event";
const times = new Collection()

// const adjectives = ["Creative", "Beautiful", "Smelly", "Comfortable", "Cosy", "Strange", "Cursed", "Abandoned", "Popular", "Edgy"]
// const nouns = ["Corner", "Hub", "Hut", "Bar", "Zone", "Room", "Kitchen", "Hangout", "House", "Palace", "Temple", "Castle"]
export default new Event({
  name: "voiceStateUpdate",
  async run(client, oldState, newState) {
    
    if (oldState.member?.user.bot) return
    if (newState.channel?.id === "1002931418785124487" && newState.member) await createChannel(newState, client) // Checking if it's the specific channel
    if (oldState.channel?.name.startsWith("『💫』") && oldState.channel.members.size === 0) await deleteChannel(client, oldState.channel) // Checking if it's a jtc channel and if it's empty
    if (oldState.channel?.name.startsWith("『💫』") && oldState.channel.members.size > 0 && !(newState.channel && oldState.channelId === newState.channelId && oldState.channel.members.size === newState.channel.members.size)) await checkChannel(client, oldState.channel) // Checking if it's a private channel and it's empty

  },
});


async function createChannel(newState: VoiceState, client: Client) {

    const stats = times.get(newState.member?.id)

    if (times && typeof stats === "number" && stats >= Date.now()) return
    const newChannel = (await newState.guild.channels.create({
      name: `『💫』Hangout`,
      type: ChannelType.GuildVoice,
      permissionOverwrites: [
        {
          id: newState.guild.id,
          deny: ["Connect", "MoveMembers"],
        }
      ],
      userLimit: 1,
      parent: newState.channel!.parent?.id,
    })); // Create the channel
      newState.setChannel(newChannel); // Move the member

      times.set(newState.member?.id, Date.now() + 30 * 1000)
      await client.database.ref(`Voice/${newChannel.id}`).set({
        owner: newState.member?.id
      })

      client.vclogs?.send(`<@${newState.member?.id}> created <#${newState.channelId}>`)

    

    return;

      // Adding to database later
}


async function deleteChannel(client: Client, channel: GuildChannel) {
    channel.delete() // Deleting the channel   
    client.vclogs?.send(`A JTC channel got deleted`)
    await client.database.ref(`Voice/${channel.id}`).remove()
}


async function checkChannel(client: Client, channel: GuildChannel) {
  console.log("Checking Channel")
  const owner = (await client.database.ref(`Voice/${channel.id}`).once("value")).val()?.owner;

  if (!channel.members.get(owner)) {
    console.log("Owner left")
    const newOwner = channel.members.filter((m) => !m.user.bot).random()

    
    if (!newOwner?.id) deleteChannel(client, channel)
    else  {

      newOwner.send(`You own the voice channel`).catch(() => undefined)
      await client.database.ref(`Voice/${channel.id}`).update({
        owner: newOwner?.id
      })
      client.vclogs?.send(`<#${channel.id}> has now a new owner (<@${newOwner.id}>)`)
    }
  }
} 


/**
 * 
 * {
        name: `『💫』Hangout`,
        type: 2,
        permissionOverwrites: [
          {
            id: newState.guild.id,
            deny: ["Connect"],
          }
        ],
        userLimit: 1,
        parent: newState.channel!.parent?.id,
      })
 */