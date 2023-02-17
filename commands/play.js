const Discord = require('discord.js')

const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
const YOUTUBE_PLAYLIST_REGEX = /[?&]list=([^#\&\?]+)/;

module.exports.run = async(client, message, args) => {
    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel) return message.reply(':x: Bu komutu kullanabilmek için herhangi bir **Ses Kanalı**\'nda olmalısın!');
    //if(message.guild.me.voice.channel && voiceChannel !== message.guild.me.voice.channel) return message.reply(':x: Şu anda başka bir kanalda şarkı çalıyorum!');

    if(args.length == 0) {
        return message.reply("Lütfen bir şarkı belirtin.");
    }

    return message.channel.send(':mag_right: **Aranıyor**: `' + args.join(' ') + '`').then(async function(m) {
        setTimeout(async () => {
            let query = args.join(" ");

            const queue = client.distube.getQueue(message.guild);
        
            if(!queue) {
                client.distube.voices.join(voiceChannel)
            }
        
            await client.distube.play(voiceChannel, query, { textChannel: message.channel, member: message.member }).then(() => m.delete()); 
        }, 1500);
    });
}

module.exports.conf = {
    aliases: ['çal', 'oynat'], 
    permLevel: 0, 
    inDev: false,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'play', 
    description: '-', 
    usage: '-', 
};