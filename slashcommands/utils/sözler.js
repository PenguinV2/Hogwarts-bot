const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

let words = [
    'Sikim hıyar desem tuzla koşarsın',
    'Bahtsız bedeviyi çölde kutup ayıları sikermiş',
    'Sikim sünnet kime minnet?',
    'Göte giren şemsiye açılmaz',
    'Sikilmiş götün davası olmaz',
    'Am razı olsa yarrak Bağdat\'tan gelir',
    'Elin sikini görmeyen kendininkini piyade tüfeği sanarmış',
    'Ankara\'nın Dikmen\'i, bir daha gidersem sik beni',
    'Acıma yetime döner koyar götüne',
    'İmam ölecek, siki gülecek',
    'Orospu\'nun tövbesi yarrağı görene kadardır',
    'Mahalle yanarken orospu saçını tararmış',
    'Seven sikilir, siken sevilir',
    'Uyandırma kerizi, kalkar siker hepimizi',
    'Esirgenen göte sik batar',
    'Hem canım cennette, hem sikim amcıkta olmaz',
    'Ağzın dünyanı sikiyor, sikin oruç tutuyor',
    '40 yıllık orospuya sikiş öğretilmez',
    'El elin sikini kılıçla arar',
    'Sikilen maymun ağaca çabuk çıkar',
    'Şöförden hacı, orospudan bacı olmaz',
    'Katranı kaynatsan olur mu şeker, cinsini siktiğim cinsine çeker'
];

module.exports = {
    data: new SlashCommandBuilder().setName("söz").setDescription("Atalarımızdan(?) bizlere kalan yegane sözler. (Biraz küfürlüdür.)"),
	run: async(client, interaction) => {
        let embed = new Discord.EmbedBuilder()
        .setDescription(words[Math.floor(Math.random() * words.length)] + ".")
        .setColor("White")

        await interaction.reply({ embeds: [embed] })
    }
}