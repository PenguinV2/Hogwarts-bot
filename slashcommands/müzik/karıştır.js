const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("shuffle").setDescription("Şarkı kuyruğunu karıştırır"),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        queue.shuffle();
        return await interaction.reply(":white_check_mark: Kuyruk karıştırıldı!")
    }
}