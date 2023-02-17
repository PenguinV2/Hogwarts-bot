const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("yardım").setDescription("Bot komutları hakkında bilgi verir."),
	run: async(client, interaction) => {
        await interaction.reply("**Yardıma ihtiyacın yok yeğenim**.\n\n**Şarkı çalmak** için **.play**!")
    }
}