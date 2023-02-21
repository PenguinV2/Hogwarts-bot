const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("resume").setDescription("Aktif olarak çalan şarkıyı durdurur."),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        client.distube.resume(interaction.guild.id);
        return interaction.reply(":arrow_forward: Parti kaldığı yerden devam ediyor!")
    }
}