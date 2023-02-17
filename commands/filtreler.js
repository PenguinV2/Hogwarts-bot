const Discord = require('discord.js')

let filters = ["3d", "bassboost", "vaporwave", "echo", "karaoke", "nightcore", "hepsi", "kapat"]
let fixed = {
    "3d": "3D",
    "bassboost": "Bass boost",
    "vaporwave": "Vaporwave",
    "echo": "Echo",
    "karaoke": "Karaoke",
    "nightcore": "Nightcore"
}

module.exports.run = async(client, message, args) => {
    const queue = client.distube.getQueue(message)
    if(!queue) return message.reply(`Şu anda herhangi bir şarkı çalmıyorum.`)

    if(args.length == 0) return message.reply("Hangi filtreyi eklemek istiyorsunuz? Ekleyebileceğiniz filtreler: " + filters.map(f => "**" + f + "**").join(",") + ".") 
    if(args.length > 1) return message.reply("Lütfen filtreyi doğru girin. Filtreler: " + filters.map(f => "**" + f + "**").join(", ") + ".") 

    let filter = args[0].toLowerCase();

    if(filters.indexOf(filter) !== -1) {
        if(filter.toLowerCase() == "kapat") {
            queue.filters.clear()
            return message.reply(":white_check_mark: **Tüm filtreler silindi**!");
        } else if(filter.toLowerCase() == "hepsi") {
            filters.forEach(f => {
                if(f != "hepsi" || f != "kapat") queue.filters.add(f);
            });
            return message.reply(":white_check_mark: **Tüm filtreler eklendi**!");
        } else {
            queue.filters.add(filter);
            return message.reply(":white_check_mark: **" + fixed[filter.toLowerCase()] + "** filtresi eklendi!");
        }
    } else {
        return message.reply(":x: Böyle bir filtre yok!")
    }
}

module.exports.conf = {
    aliases: ["filters", "filter"], 
    permLevel: 0, 
    isDev: true,
    kategori: "Müzik" 
};

module.exports.help = {
    name: 'filtre', 
    description: '-', 
    usage: '-', 
};