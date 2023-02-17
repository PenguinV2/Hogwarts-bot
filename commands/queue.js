const Discord = require('discord.js')
const Utils = require("../utils/Utils")

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if(!queue) return message.reply(`Şu anda şarkı çalmıyorum!`)
    
    var i = 1;
    var queueMessages = [];

    if(queue.songs.length <= 0) return message.channel.send(":thinking: Kuyrukta herhangi bir şarkı yok.");

    queue.songs.forEach(songData => {
        if(songData != queue.songs[0]) {
            let title = songData.name.length >= 30 ? songData.name.substring(0, 30) + "..." : songData.name
            let url = songData.url;
            let duration = songData.formattedDuration
            let requester = songData.member.user.username

            queueMessages.push(`**${i}**. **[${title}](${url})** (${duration}) **[${requester}]**`);
            i++;
        }
    });
    
    let page = args.length === 1 ? args[0] : 1;
    if(isNaN(page)) page = 1;

    if(page <= 0) page = 1;
    const paginated = Utils.paginate(queueMessages, 1, 15);
    if(page > paginated.maxPage) page = paginated.maxPage;

    let embed = new Discord.EmbedBuilder()
    .setColor("White")
    .setThumbnail(client.user.avatarURL())
    .setDescription(paginated.items.join("\n"))
    .setAuthor({ name: `${message.guild.name} sunucusu için Şarkı Kuyruğu`, iconURL: message.guild.iconURL() })
    .setFooter({ text: `Sayfa: ${page} | Toplam Sayfa: ${paginated.maxPage} | .queue ${page + 1} yazarak sonraki sayfaya geçebilirsiniz!`, iconURL: message.author.avatarURL() })
    .addFields(
        {
            name: "Şu anda çalan",
            value: `**[${queue.songs[0].name}](${queue.songs[0].url})** (${queue.songs[0].formattedDuration})`,
            inline: false
        },
        {
            name: "Toplam süre",
            value: queue.formattedDuration,
            inline: true
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: true
        },
        {
            name: "Kuyruktaki şarkı sayısı",
            value: "" + (i - 1),
            inline: true
        },
        {
            name: "Şarkı çalınan kanal",
            value: message.guild.members.me.voice.channel ? message.guild.members.me.voice.channel.name : "Yok",
            inline: true
        }
    ).setColor("White")

    return message.channel.send({ embeds: [embed] })
}

module.exports.conf = {
    aliases: ['kuyruk'], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'queue', 
    description: '-', 
    usage: '-', 
};