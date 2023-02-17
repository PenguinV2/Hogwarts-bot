const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if(!queue) return message.reply(`Lütfen önce kuyruğa bir şarkı ekleyin.`)

    if(queue.repeatMode == 0) {
        queue.setRepeatMode(1)
        return message.reply(":repeat: Şarkı döngüsü başlatıldı!")
    } else if(queue.repeatMode == 1) {
        queue.setRepeatMode(0)
        return message.reply(":repeat: Döngü durduruldu!")
    }
}

module.exports.conf = {
    aliases: ['repeat', 'dongu'], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'döngü', 
    description: '-', 
    usage: '-', 
};