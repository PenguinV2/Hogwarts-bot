const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if(!queue) return message.reply(`Şu anda şarkı çalmıyorum!`)
    client.distube.voices.leave(message)
    return message.channel.send(":cry: **Neden durdurdun**? Yoksa performansımı beğenmedin mi :(");
}

module.exports.conf = {
    aliases: ['durdur'], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'stop', 
    description: '-', 
    usage: '-', 
};