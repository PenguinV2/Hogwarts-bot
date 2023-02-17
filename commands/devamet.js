const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if(!queue) return message.reply(`Şu anda herhangi bir şarkı çalmıyorum.`)

    client.distube.resume(message.guild.id);
    return message.channel.send(":arrow_forward:  Durdurulma kaldırıldı, parti devam ediyor!")
}

module.exports.conf = {
    aliases: ["resume"], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'devamet', 
    description: '-', 
    usage: '-', 
};