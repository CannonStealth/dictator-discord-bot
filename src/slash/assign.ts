import { Role, GuildMember } from "discord.js"
import message from "../events/message"
import { Slash } from "../structures/Commands"
import { SlashCommandBuilder } from "discord.js"

export default new Slash({
    name: "assign",
    description: "Assigns a role to a member",
    permissions: "ManageRoles",
    options: [{
        name: "member",
        description: "The member that the role will be assigned to",
        type: 6,
        required: true
    }, {
        name: "role",
        description: "The role that will be given to the member",
        type: 8,
        required: true
    }],
    async run({ interaction }) {

        if (!interaction.channel) return;
        try {
        const member = interaction.options.getMember("member")
        const role = interaction.options.get("role")?.role

        if (!member || !(member instanceof GuildMember)) return interaction.channel?.send("THERE'S NO MEMBER")
        if (!role || !(role instanceof Role)) return interaction.channel?.send("THERE'S NO ROLE")

        member.roles.add(role);
        return interaction.reply("Done")

        } catch {
            return interaction.channel.send("Something went wrong")
        }

    }
})