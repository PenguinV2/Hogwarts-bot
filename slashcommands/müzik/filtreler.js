const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

let filters = ["3d", "bassboost", "vaporwave", "echo", "karaoke", "nightcore", "hepsi", "kapat"]
let fixed = {
    "3d": "3D",
    "bassboost": "Bass boost",
    "vaporwave": "Vaporwave",
    "echo": "Echo",
    "karaoke": "Karaoke",
    "nightcore": "Nightcore"
}

module.exports = {
    data: new SlashCommandBuilder().setName("filtreler").setDescription("Aktif olarak çalınan şarkıya belirtilen filtre/filtreleri ekler.")
        .addStringOption(option => 
            option
            .setName("filtre")
            .setRequired(true)
            .setDescription("Lütfen bir filtre belirtin.")
            .addChoices(
                { name: "3d", value: "3d" },
                { name: "bassboost", value: "bassboost" },
                { name: "vaporwave", value: "vaporwave" },
                { name: "echo", value: "echo" },
                { name: "karaoke", value: "karaoke" },
                { name: "nightcore", value: "nightcore" },
                { name: "hepsi", value: "hepsi" },
                { name: "kapat", value: "kapat" },
            )
        ),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        let filter = interaction.options.getString("filtre").toLowerCase();
        
        if(!filters.includes(filter)) return await interaction.reply({ content: ":x: Belirtilen filte bulunamadı.", ephemeral: true })

        if(filter == "kapat") {
            queue.filters.clear()
            return await interaction.reply(":white_check_mark: **Tüm filtreler silindi**!");
        } else if(filter == "hepsi") {
            filters.forEach(f => {
                if(f.toLowerCase() != "hepsi" || f.toLowerCase() != "kapat") queue.filters.add(f);
            });
            return await interaction.reply(":white_check_mark: **Tüm filtreler eklendi**!");
        } else {
            queue.filters.add(filter);
            return await interaction.reply(":white_check_mark: **" + fixed[filter.toLowerCase()] + "** filtresi eklendi!");
        }
    }
}