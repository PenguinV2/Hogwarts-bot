const Discord = require('discord.js');

exports.run = async function(client, message, args) {
    if(args.length === 0) return message.channel.send(':x: Lütfen bir şarkı ismi girin.');
    let songName = args.join(' ');
    const Lyrics = require('../utils/Lyrics');

    return message.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'loading')} Veriler alınıyor...`).then(async verimsg => {
        await Lyrics.getLyrics(`search?q=${encodeURI(songName)}`).then(data => {
            if(data[0].lyrics.length > 0) {
                let embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${data[0].artist} - ${data[0].extendedsong} | Şarkı Sözleri` })
                .setDescription(data[0].lyrics.length > 1900 ? data[0].lyrics.substring(0, 1900) + `...\n\n**[Buraya](${data[0].lyricsURL}) tıklayarak şarkı sözlerinin tamamına ulaşabilirsiniz**.` : data[0].lyrics)
                .setThumbnail(data[0].picture)
                .setFooter({ text: `${message.author.tag} tarafından istendi.`, iconURL: message.author.avatarURL() })
                .setTimestamp()
                .setColor("White");

                verimsg.delete();
                message.channel.send({ embeds: [embed] });
            } else {
                let embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${data[0].artist} - ${data[0].extendedsong} | Şarkı Sözleri` })
                .setDescription(data[0].lyrics.length > 1900 ? data[0].lyrics.substring(0, 1900) + `...\n\n**[Buraya](${data[0].lyricsURL}) tıklayarak şarkı sözlerinin tamamına ulaşabilirsiniz**.` : data[0].lyrics)
                .setThumbnail(data[0].picture)
                .setFooter({ text: `${message.author.tag} tarafından istendi.`, iconURL: message.author.avatarURL() })
                .setTimestamp()
                .setColor("White");

                verimsg.delete();
                message.channel.send({ embeds: [embed] });
            }
        }).catch(e => {
            if(e === "NO_SONG_FOUND") {
                return verimsg.edit(':x: Aradığınız başlıkla eşleşen bir şarkı bulunamadı.');
            } else if(e === "NO_LYRICS_FOUND") {
                return verimsg.edit(':x: Bir hata oluştu! Lütfen daha sonra tekrar deneyin.');
            } else if(e === "NO_RESPONSE") {
                return verimsg.edit(':x: Bir hata oluştu! Lütfen daha sonra tekrar deneyin.');
            }
        })
    });
};

exports.conf = {
    enabled: true, 
    guildOnly: true, 
    aliases: ['şarkı-sözü', 'şarkısözü', 'lyrics'], 
    permLevel: 0,
    devMode: true,
    kategori: 'Müzik'
};

exports.help = {
    name: 'şarkı-sözleri', 
    description: 'Belirtlen şarkının sözlerini gönderir.',
    usage: 'şarkı-sözleri Ben Fero - 3 2 1' 
};