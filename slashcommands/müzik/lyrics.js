const Discord = require('discord.js')
const { SlashCommandBuilder } = require("discord.js");

const Lyrics = require('../../utils/Lyrics');

module.exports = {
    inDev: true,
    data: new SlashCommandBuilder().setName("lyrics").setDescription("Belirtilen şarkının sözlerini gösterir.").addStringOption(option => option.setName("şarkı").setRequired(true).setDescription("Lütfen hangi şarkının sözlerini istediğinizi belirtin.")),
	run: async(client, interaction) => {
        let songName = interaction.options.getString("şarkı");

        const data = await Lyrics.getLyrics(`search?q=${encodeURI(songName)}`).catch(async () => { await interaction.reply({ content: ":x: Bir hata oluştu!", ephemeral: true }) });
 
        let embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `${data[0].artist} - ${data[0].extendedsong} | Şarkı Sözleri` })
        .setDescription(data[0].lyrics.length > 1900 ? data[0].lyrics.substring(0, 1900) + `...\n\n**[Buraya](${data[0].lyricsURL}) tıklayarak şarkı sözlerinin tamamına ulaşabilirsiniz**.` : data[0].lyrics)
        .setThumbnail(data[0].picture)
        .setFooter({ text: `${interaction.member.tag} tarafından istendi.`, iconURL: interaction.member.avatarURL() })
        .setColor("White");

        return await interaction.reply({ embeds: [embed] })
    }
}