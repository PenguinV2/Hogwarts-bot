const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`Şu anda hiçbir şarkı çalmıyorum.`)
    const song = queue.songs[0]
    return message.channel.send(":information_source: Şu anda çalan şarkı: **" + song.name + "** | *<@" + song.member.id + "> tarafından istendi.*")
}

module.exports.conf = {
    aliases: ['np'], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'mowplaying', 
    description: '-', 
    usage: '-', 
};