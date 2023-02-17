const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("sahibem").setDescription("Sahibem, üstadım, yapımcım saygıdeğer Adnan Bey hakkında bilgi verir."),
	run: async(client, interaction) => {
        await interaction.reply("**Sahibem**: <@524947415153770526> | `Daha fazla bilgi için DM`")
    }
}