const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if(!queue) return message.reply(`Şu anda herhangi bir şarkı çalmıyorum.`)

    client.distube.pause(message.guild.id);
    return message.channel.send(":pause_button: Şu anda çalan şarkı durduruldu!")
}

module.exports.conf = {
    aliases: ["pause"], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'duraklat', 
    description: '-', 
    usage: '-', 
};