const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("skip").setDescription("Aktif olarak çalan şarkıyı atlar."),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        try {
            await queue.skip().then(async () => {
                return await interaction.reply(":white_check_mark: Bir sonraki şarkıya geçiliyor.").then(r => {
                    setTimeout(async () => {
                        await interaction.deleteReply()
                    }, 1500);
                });
            })
        } catch (e) {
            if(e.message == "There is no up next song") {
                return await interaction.reply("Bu şarkıyı geçebilmem için bundan sonra bir şarkı olması lazım değil mi güzel kardeşim? **Sıraya şarkı ekle ki geçebileyim**.")
            }
            console.error(e)
        }
    }
}