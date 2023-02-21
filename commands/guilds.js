const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    if(message.author.id != "524947415153770526") return;

    let _gmsg = "";
    _gmsg = `Sunucular (**${client.guilds.cache.size}**): ${client.guilds.cache.map(g => "**" + g.name + "**").join(", ")}`
    return message.channel.send(_gmsg);
}

module.exports.conf = {
    aliases: [], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'guilds', 
    description: '-', 
    usage: '-', 
};