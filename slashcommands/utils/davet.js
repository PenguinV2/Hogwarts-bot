const Discord = require('discord.js')
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("davet").setDescription("Hogwarts Bot'un davet linkini gönderir."),
	run: async(client, interaction) => {
        let embed = new Discord.EmbedBuilder()
        .setDescription(`**[Buraya](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1099511627775)** tıklayarak beni sunucuna davet edebilirsin!`)
        .setColor("White");

        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
}