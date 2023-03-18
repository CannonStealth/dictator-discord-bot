import { Slash } from "../structures/Commands"

export default new Slash({
    name: "testtwo",
    description: "A test command",
    run({ interaction }) {
        interaction.reply("Hello World")
    }
}) 