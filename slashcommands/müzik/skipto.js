const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("skipto").setDescription("Aktif olarak çalan şarkıyı durdurup belirtilen şarkıya direkt olarak atlar.")
        .addIntegerOption(option => 
            option
            .setName("number")
            .setRequired(true)
            .setDescription("Lütfen hangi şarkıya atlamak istediğinizi belirtin. | Örnek kullanım: /skipto 7")
        ),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        let number = interaction.options.getInteger("number");
        
        await client.distube.jump(interaction, number).then(() => {
            return interaction.reply(":kangaroo: **" + number + "** numaralı şarkıya atlandı!");
        }).catch(e => {
            console.log(e.message);
            return interaction.reply(":x: Belirtilen şarkıya atlarken bir hata oluştu!");
        });
    }
}