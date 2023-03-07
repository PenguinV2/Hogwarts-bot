const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

function isURL(str) {
    var pattern = new RegExp('^((https?:)?\\/\\/)?'+ // protocol
        '(?:\\S+(?::\\S*)?@)?' + // authentication
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locater
    if (!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}

function isTwitchURL(str) {
    return new RegExp('(^http(s)?://)?((www|en-es|en-gb|secure|beta|ro|www-origin|en-ca|fr-ca|lt|zh-tw|he|id|ca|mk|lv|ma|tl|hi|ar|bg|vi|th)\.)?twitch.tv/(?!directory|p|user/legal|admin|login|signup|jobs)(?P<channel>\w+)').test(str);
}

module.exports = {
    data: new SlashCommandBuilder().setName("play").setDescription("Belirtilen şarkıyı çalar.")
        .addStringOption(option => 
            option
            .setName("şarkı")
            .setRequired(true)
            .setDescription("Lütfen bir şarkı belirtin.")
        ),
	run: async(client, interaction) => {
        const voiceChannel = interaction.member.voice.channel;
        if(!voiceChannel) return await interaction.reply({ content: `:x: Bu komutu kullanabilmek için herhangi bir **Ses Kanalı**'nda olmalısın!`, ephemeral: true })

        if(interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channel.id != interaction.member.voice.channel.id) return await interaction.reply({ content: `:x: Bu komutu kullanabilmek için benimle aynı kanalda olmalısın!`, ephemeral: true })

        let query = interaction.options.getString("şarkı");
        
        await interaction.deferReply({ ephemeral: true });

        const queue = client.distube.getQueue(interaction.guild);
        
        if(!queue) {
            client.distube.voices.join(voiceChannel)
        }
    
        try {
            await client.distube.play(voiceChannel, query, { textChannel: interaction.channel, member: interaction.member }).then(async () => await interaction.deleteReply()); 
        } catch (e) {
            console.error(e);
            return await interaction.reply(":x: **Bir hata oluştu**! Lütfen daha sonra tekrar deneyin.")
        }
    }
}