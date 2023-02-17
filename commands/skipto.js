const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if(!queue) return message.reply(`Lütfen önce kuyruğa bir şarkı ekleyin.`)
    
    if(args.length == 0) return message.reply(":question: Hangi şarkıya atlamak istiyorsun? .kuyruk komutunu kullanarak şarkı numarasını yazmalısın. | Örnek kullanım: ```.skipto 3```")
    let number = args[0];

    if(isNaN(number)) return message.reply(":x: Lütfen doğru bir sayı gir!");

    number = Number(args[0]);

    await client.distube.jump(message, number).then(songData => {
        return message.channel.send(":kangaroo: **" + number + "** numaralı şarkıya atlandı!");
    });
 }

module.exports.conf = {
    aliases: ['atla'], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'skipto', 
    description: '-', 
    usage: '-', 
};