const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");
const Utils = require("../../utils/Utils")

module.exports = {
    data: new SlashCommandBuilder().setName("nowplaying").setDescription("Aktif olarak çalan şarkı hakkında bilgi verir."),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        const song = queue.songs[0]
        if(!song) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        let msg = "";
    
        if(song.source == "twitch:stream") {
            let channelName = song.name.split(" (live) ")[0]
            msg = ":information_source: Şu anda çalan: **" + channelName + "** Twitch yayını! | *<@" + song.member.id + "> tarafından istendi.*"
        } else {
            msg  = ":information_source: Şu anda çalan şarkı: **" + song.name + "** | *<@" + song.member.id + "> tarafından istendi.*"
        }
    
        if(song.source != "twitch:stream") {
            let desc = [
                ":information_source: **Şu anda çalan**:",
                `**[${song.name}](${song.url})**`,
                "",
                "\u23ef " + Utils.getProgressBar(queue.currentTime, song.duration) + ` (${queue.formattedCurrentTime}/${song.formattedDuration})`,
                "",
                `**DJ**: <@${song.member.id}>`
            ];
        
            let embed = new Discord.EmbedBuilder()
            .setDescription(desc.join("\n"))
            .setColor("White")
        
            return await interaction.reply({ embeds: [embed] })
        } else {
            let desc = [
                ":information_source: **Şu anda çalan**:",
                `**[${song.name.split(" (live) ")[0]}](${song.url})** Twitch yayını!`,
                "",
                "\u23ef " + Utils.getProgressBar(queue.currentTime, song.duration) + ` (Canlı yayın)`,
                "",
                `**DJ**: <@${song.member.id}>`
            ];
        
            let embed = new Discord.EmbedBuilder()
            .setDescription(desc.join("\n"))
            .setColor("White")
        
            return await interaction.reply({ embeds: [embed] })
        }
    }
}