const Discord = require('discord.js')
const { SlashCommandBuilder } = require("discord.js");
const Utils = require("../../utils/Utils")

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("Şarkı kuyruğunu gösterir.")
        .addNumberOption(page => 
            page
            .setRequired(false)
            .setName("sayfa")
            .setDescription("Belirtilen sayfa numarasını gösterir.")

        ),
	run: async(client, interaction) => {
        const queue = client.distube.getQueue(interaction)
        if(!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

        var i = 1;
        var queueMessages = [];

        if((queue.songs.length - 1) == 0) {
            queueMessages.push("Şarkı kuyruğu boş görünüyor.");
            queueMessages.push(`**/play** komutunu kullanarak kuyruğa şarkılar ekleyebilirsiniz!`);
        } else {
            queue.songs.forEach(songData => {
                if(songData != queue.songs[0]) {
                    let title = songData.name.length >= 30 ? songData.name.substring(0, 30) + "..." : songData.name
                    let url = songData.url;
                    let duration = songData.formattedDuration
                    let requester = songData.member.user.username
    
                    if(!songData.source.includes("twitch")) {
                        queueMessages.push(`**${i}**. **[${title}](${url})** (${duration}) **[${requester}]**`);
                    } else {
                        queueMessages.push(`**${i}**. **[${title.split(" (live) ")[0]}](${url})** Twitch yayını **[${requester}]**`);
                    }
                    i++;
                }
            });
        }
        
        let page = interaction.options.getNumber("sayfa") ? interaction.options.getNumber("sayfa") : 1;
        if(isNaN(page)) page = 1;

        if(page <= 0) page = 1;
        const paginated = Utils.paginate(queueMessages, page, 15);
        if(page > paginated.maxPage) page = paginated.maxPage;

        let embed = new Discord.EmbedBuilder()
        .setColor("White")
        .setThumbnail(client.user.avatarURL())
        .setDescription(paginated.items.join("\n"))
        .setAuthor({ name: `${interaction.guild.name} sunucusu için şarkı kuyruğu`, iconURL: interaction.guild.iconURL() })
        .setFooter({ text: `Sayfa: ${page} | Toplam Sayfa: ${paginated.maxPage} | .queue ${page + 1} yazarak sonraki sayfaya geçebilirsiniz!`, iconURL: interaction.member.avatarURL() })
        .addFields(
            {
                name: "Şu anda çalan",
                value: `**[${queue.songs[0].name}](${queue.songs[0].url})** (${queue.songs[0].formattedDuration})`,
                inline: false
            },
            {
                name: "Toplam süre",
                value: "`" + queue.formattedDuration + "`",
                inline: true
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: true
            },
            {
                name: "Kuyruktaki şarkı sayısı",
                value: "`" + (i - 1) + "`",
                inline: true
            },
            {
                name: "Şarkı çalınan kanal",
                value: interaction.guild.members.me.voice.channel ? "`" + interaction.guild.members.me.voice.channel.name + "`" : "`Yok`",
                inline: true
            },
            {
                name: "Ses seviyesi",
                value: "`%" + queue.volume + "`",
                inline: true
            }
        ).setColor("White")

        return await interaction.reply({ embeds: [embed] })
    }
}