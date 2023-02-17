const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("atatürk").setDescription("<3"),
	run: async(client, interaction) => {
        const url = "https://api.emirkabal.com/v1/ataturk";

        try {
            request(url, async function(err, resp, body) {
                let data = JSON.parse(body);
                let rgif = data.url;

                let embed = new Discord.EmbedBuilder()
                .setImage(rgif)
                .setColor("NotQuiteBlack");

                await interaction.reply({ embeds: [embed] })
            });
        } catch(e) {
            await interaction.reply(":x: Ne yazık ki bir hata oluştu.")
        }
    }
}