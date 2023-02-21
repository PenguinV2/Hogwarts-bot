const Discord = require('discord.js')
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("Çalan şarkıyı durdurur."),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        client.distube.pause(interaction.guild.id);
        return interaction.reply(":pause_button: Şu anda çalan şarkı durduruldu!")
    }
}