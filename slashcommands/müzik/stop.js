const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("stop").setDescription("Çalan şarkıyı durdurur ve odadan ayrılır."),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        client.distube.voices.leave(interaction)
        return await interaction.reply(":cry: **Neden durdurdun**? Yoksa performansımı beğenmedin mi :(");
    }
}