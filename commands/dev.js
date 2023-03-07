const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    if(message.author.id != "524947415153770526") return;

    let desc = [
        "**Kullanılabilecek komutlar**:",
        "",
        ".dev **guildList**",
        ".dev **guildInfo <guildId>**"
    ];

    var embed_1 = new Discord.EmbedBuilder()
    .setDescription(desc.join("\n"))
    .setColor("DarkRed")
    .setTimestamp()
    
    if(args.length == 0) return message.channel.send({ embeds: [embed_1] })

    if(args.length == 1) {
        let wanted = args[0];
        if(wanted.toLowerCase() != "guildlist") return message.channel.send({ embeds: [embed_1] })

        if(wanted.toLowerCase() == "guildlist") {
            let embed_1 = new Discord.EmbedBuilder()
            .setDescription(`**Sunucu listesi**:\n${client.guilds.cache.map(g => "**" + g.name + "** | **" + g.id + "**").join("\n")}`)
            .setColor("DarkGreen")
            .setTimestamp()

            return message.channel.send({ embeds: [embed_1] })
        }
    } else if(args.length == 2) {
        let wanted = args[0];
        //if(wanted.toLowerCase() != "guildinfo" || wanted.toLowerCase() != "guildınfo") return message.channel.send({ embeds: [embed_1] })
    
        let guildId = args[1];
        let guild;

        try {
            guild = client.guilds.cache.get(guildId)
        } catch (e) {
            return message.channel.send(":x: Bir hata oluştu! *Acaba böyle bir sunucu yok mu?*")
        }

        let voiceChannels = []

        let other = []

        if(guild.channels.cache.size >= 1) {
            guild.channels.cache.forEach(channel => {
                if(channel.type == 2) {
                    voiceChannels.push(`${channel.name} (${channel.members.size})`)
                    if(channel.members.size >= 1) {
                        let channelUsers = [];

                        channel.members.forEach(u => {
                            channelUsers.push(u.user.tag)
                        })
                        
                        other.push("**" + channel.name + "**: `" + channelUsers.join(", ") + "`")
                    }
                }
            });
        } else {
            voiceChannels.push(`Kanal bulunamadı`)
        }

        let embed_1 = new Discord.EmbedBuilder()
        .setDescription(`**Sunucu Bilgisi**:\nToplam kullanıcı: **${guild.memberCount}**\nBot sayısı: **${guild.members.cache.filter(m => m.user.bot).size}**\nNormal kullanıcı sayısı: **${guild.members.cache.filter(m => !m.user.bot).size}**`)
        .setColor("Random")
        .addFields(
            {
                name: "Ses kanalları",
                value: "`" + voiceChannels.join(", ") + "`"
            },
            {
                name: "Metin kanalları",
                value: "`" + guild.channels.cache.filter(c => c.type == 0 && c.type != 4).map(c => c.name).join(", ") + "`" 
            },
            {
                name: "Şu anda çalan şarkı",
                value: `${client.distube.getQueue(guild) ? client.distube.getQueue(guild).songs[0] ? client.distube.getQueue(guild).songs[0].name : "`Şu anda şarkı çalmıyor`" : "`Şu anda şarkı çalmıyor`"}`,
            },
            {
                name: "Bot nerede?",
                value: "`" + (guild.channels.cache.filter(c => c.type == 2 && c.members.has(client.user.id)).map(a => a.name).length > 0 ? guild.channels.cache.filter(c => c.type == 2 && c.members.has(client.user.id)).map(a => a.name) : "Herhangi bir ses kanalında değil") + "`"
            },
            {
                name: "...",
                value: other.length >= 1 ? other.join("\n") : "?"
            }
        )
        .setTimestamp()

        return message.channel.send({ embeds: [embed_1] })

    }
}

module.exports.conf = {
    aliases: [], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'dev', 
    description: '-', 
    usage: '-', 
};