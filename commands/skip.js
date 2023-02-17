const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if(!queue) return message.reply(`Lütfen önce kuyruğa bir şarkı ekleyin.`)
    try {
        await queue.skip()
    } catch (e) {
        console.error(e)
    }
}

module.exports.conf = {
    aliases: ['geç'], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'skip', 
    description: '-', 
    usage: '-', 
};