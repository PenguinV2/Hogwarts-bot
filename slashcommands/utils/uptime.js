const Discord = require('discord.js')
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("uptime").setDescription("Botun ne kadar süredir açık olduğunu gösterir."),
	run: async(client, interaction) => {
        const moment = require("moment");
        require("moment-duration-format");
        const duration = moment.duration(client.uptime).format("D [gün], H [saat], m [dakika], s [saniye]");

        await interaction.reply({ content: "Aktif olduğum süre: " +  duration, ephemeral: true })
    }
}