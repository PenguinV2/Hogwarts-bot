const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("volume").setDescription("Aktif olarak çalan şarkının ses seviyesini ayarlar.")
        .addIntegerOption(option => 
            option
            .setName("number")
            .setRequired(true)
            .setDescription("Lütfen ses seviyesi belirtin.")
        ),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        let number = interaction.options.getInteger("number");
        
        queue.setVolume(number)
        return await interaction.reply(":white_check_mark: Ses seviyesi **" + number + "** olarak güncellendi!")
    }
}