import {Command} from "../structures/Commands";
import { warns } from "../utils/warns";

export default new Command({
  name: "unwarn",
  permissions: ["ModerateMembers"],
  async run({ client, message, args }) {
    try {
      const user = await client.getMember("USER", message, args[0]);

      if (!user) return message.channel.send("You didn't mention anyone");

      if (user.id === message.author.id) return message.channel.send("You can't unwarn yourself")
      if (isNaN(+args[1])) return message.channel.send("Invalid warn number");
      
      const i = +args[1] - 1;

      const schema = await warns.findById(user.id);

      if (!schema || !schema.warns?.length)
        return message.channel.send("This user doesn't have any warnings");

      if (!schema.warns[i])
        return message.channel.send("That warn does not exist");

      schema.warns.splice(i, 1);

      await schema.save();

      message.channel.send(`Removed warn **${args[1]}** from <@${user.id}>`);
 
      return;
    } catch {
      return message.channel.send("Error!");
    }
  },
});
