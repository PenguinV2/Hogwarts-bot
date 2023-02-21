const Discord = require('discord.js')
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    inDev: true,
    data: new SlashCommandBuilder().setName("repeat").setDescription("Çalan şarkıyı döngüye sokar."),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        if(queue.songs[0].source == "twitch:stream") return await interaction.reply("**Twitch** yayınlarını dinlerken bu komutu kullanamazsınız!");

        if(queue.repeatMode == 0) {
            queue.setRepeatMode(1)
            return await interaction.reply(":repeat: Şarkı döngüsü başlatıldı! *Döngüyü kapatmak için /repeat*")
        } else if(queue.repeatMode == 1) {
            queue.setRepeatMode(0)
            return await interaction.reply(":repeat: Döngü durduruldu! *Döngüyü açmak için /repeat*")
        }
    }
}