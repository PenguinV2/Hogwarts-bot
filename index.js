const { GatewayIntentBits, Partials, ActivityType, REST, Routes } = require("discord.js")
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [ Partials.Channel ],
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

global.client = client;

const fs = require("fs");
const config = require("./config.json");

let PREFIX = !config.DEVELOPMENT_MODE ? config.PREFIX : ".dev";

const { DisTube, default: dist } = require('distube')
const { Player } = require("discord-player");
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { SpotifyPlugin } = require('@distube/spotify')

const path = require("path")

const player = new Player(client);
client.player = player;
const distube = new DisTube(client, {
    leaveOnStop: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    leaveOnEmpty: true,
    plugins: [
        new YtDlpPlugin(),
        new SpotifyPlugin({ emitEventsAfterFetching: true })
    ]
});

let CATEGORIES = ["müzik", "utils"]

client.slashCommands = new Discord.Collection();

CATEGORIES.forEach(category => {
    let slashcCommandsPath = path.join(__dirname, 'slashcommands/' + category);
    let slashCommandFiles = fs.readdirSync(slashcCommandsPath).filter(file => file.endsWith('.js'));

    for (const file of slashCommandFiles) {
        const filePath = path.join(slashcCommandsPath, file);
        const command = require(filePath);
    
        if ('data' in command) {
            client.slashCommands.set(command.data.name, command);
            console.log(`Loaded /${command.data.name} command!`)
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" property.`);
        }
    }
});

let _slashCommands = [];

CATEGORIES.forEach(category => {
    let __commandFiles = fs.readdirSync('./slashcommands/' + category).filter(file => file.endsWith('.js'));

    for(const f of __commandFiles) {
        const command = require(`./slashcommands/${category}/${f}`);
        _slashCommands.push(command.data.toJSON());
    }
});

client.on("interactionCreate", async interaction => {
	if(!interaction.isChatInputCommand()) return;
    if(!interaction.guild) return interaction.reply({ content: ":x: Komutları sadece sunucularda kullanabilirsiniz!" });

	const command = interaction.client.slashCommands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
        if(typeof(command.inDev) != undefined && !command.inDev) {
		    await command.run(client, interaction);
        } else {
            if(interaction.member.id == "524947415153770526") {
                await command.run(client, interaction);
            } else {
                let _msg = `:cry: Sn. ${"<@" + interaction.member.id + ">"}, affınıza sığınarak bu komutun şu anda **geliştirilme aşamasında** olduğunu belirtmek isterim.`
                await interaction.reply({ content: _msg, ephemeral: true });
            }
        }
	} catch (error) {
		console.error("''" + error + "'' has occured while executing /" + interaction.commandName + " command on guild " + interaction.guild.name + "/" + interaction.guild.id);
	}
});

const rest = new REST({ version: '10' }).setToken(!config.DEVELOPMENT_MODE ? process.env.BOT_TOKEN : config.BOT_TOKEN_DEV);

(async () => {
	try {
		const data = await rest.put(Routes.applicationCommands(!config.DEVELOPMENT_MODE ? "1075585526775689226" : "1076537427600089118"), { body: _slashCommands });
		console.log(`Total ${data.length} '/' command is active!`);
	} catch (error) {
		console.error(error);
	}
})();

client.distube = distube;

distube.on("playSong", async function(queue, song) {
    if(song.source != "twitch:stream") {
        let embed = new Discord.EmbedBuilder()
        .setColor(song.source.includes("spotify") ? "Green" : song.source.includes("twitch") ? "Purple" : song.source.includes("youtube") ? "Red" : "White")
        .setTitle(":notes: **Çalıyor** :notes:")
        .setDescription(`**[${song.name}](${song.url})**`)
        .setTimestamp()
        .setFooter({ text: "Hogwarts Bot", iconURL: client.user.avatarURL() })
        .addFields(
            { name: "DJ", value: `<@${song.member.id}>`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "Süre", value: "`" + song.formattedDuration + "`", inline: true }
        )
        .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [embed] })
    } else {
        queue.setRepeatMode(1)

        let embed = new Discord.EmbedBuilder()
        .setColor(song.source.includes("spotify") ? "Green" : song.source.includes("twitch") ? "Purple" : song.source.includes("youtube") ? "Red" : "White")
        .setTitle(":notes: **Çalıyor** :notes:")
        .setDescription(`**[${song.name.split(" (live) ")[0]}](${song.url})** Twitch yayını!`)
        .setTimestamp()
        .setFooter({ text: "Hogwarts Bot", iconURL: client.user.avatarURL() })
        .addFields(
            { name: "DJ", value: `<@${song.member.id}>`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "Süre", value: "`Canlı Yayın`", inline: true }
        )
        .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [embed] })
    }
});

distube.on("addSong", async function(queue, song) { 
    if(song.source != "twitch:stream") {
        let embed = new Discord.EmbedBuilder()
        .setColor(song.source.includes("spotify") ? "Green" : song.source.includes("twitch") ? "Purple" : song.source.includes("youtube") ? "Red" : "White")
        .setTitle(":white_check_mark: **Sıraya eklendi**")
        .setDescription(`**[${song.name}](${song.url})**`)
        .setTimestamp()
        .setFooter({ text: "Hogwarts Bot", iconURL: client.user.avatarURL() })
        .addFields(
            { name: "DJ", value: `<@${song.member.id}>`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "Süre", value: "`" + song.formattedDuration == "Live" ? "`Canlı Yayın`" : "`" + song.formattedDuration + "`", inline: true }
        )
        .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [embed] });
    } else {
        let embed = new Discord.EmbedBuilder()
        .setColor(song.source.includes("spotify") ? "Green" : song.source.includes("twitch") ? "Purple" : song.source.includes("youtube") ? "Red" : "White")
        .setTitle(":white_check_mark: **Sıraya eklendi**")
        .setDescription(`**[${song.name.split(" (live) ")[0]}](${song.url})** Twitch yayını!`)
        .setTimestamp()
        .setFooter({ text: "Hogwarts Bot", iconURL: client.user.avatarURL() })
        .addFields(
            { name: "DJ", value: `<@${song.member.id}>`, inline: true },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "Süre", value: "`Canlı Yayın`", inline: true }
        )
        .setThumbnail(song.thumbnail)

        queue.textChannel.send({ embeds: [embed] });
    }
});

distube.on("addList", async function(queue, list) {
    let embed = new Discord.EmbedBuilder()
    .setColor(list.source.includes("spotify") ? "Green" : list.source.includes("twitch") ? "Purple" : list.source.includes("youtube") ? "Red" : "White")
    .setTitle(":white_check_mark: **Oynatma listesi sıraya eklendi**")
    .setDescription(`Oynatma listesi: **[${list.name}](${list.url})**`)
    .setTimestamp()
    .setFooter({ text: "Hogwarts Bot", iconURL: client.user.avatarURL() })
    .addFields(
        { name: "DJ", value: `<@${list.member.id}>`, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Süre", value: "`" + list.formattedDuration + "`", inline: true },
        { name: "Şu anda oynatılan", value: `**[${list.songs[0].name}](${list.songs[0].url})**`, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Oynatma listesindeki şarkı sayısı", value: "" + list.songs.length, inline: true }
    )
    .setThumbnail(list.thumbnail)

    queue.textChannel.send({ embeds: [embed] });
});

distube.on("finish", async function(queue) {
    queue.lastEmbedId = undefined;
    return queue.textChannel.send(":stopwatch: **TIME'S UP**! Ado's multipurpose bot has left from the voice channel!");
});

distube.on("disconnect", function(queue) {
    queue.setRepeatMode(0)
    queue.lastEmbedId = undefined;
});

distube.on("error", function(channel, error) {
    console.error("A DisTube error has occured on guild " + channel.guild.name + "/" + channel.guild.id + "! Error is " + error.message)
    console.error(error.stack)
});

// distube.on("empty", function(queue) {
//     queue.textChannel.send(":thinking: Şu anda yalnız başımayım ve bu odaya **15 saniye** içerisinde kimse gelmezse odadan ayrılacağım.").then(m => {
//         setTimeout(async () => {
//             await m.delete()
//         }, 15000)
//     });

//     setTimeout(() => {
//         if(queue.voiceChannel.members.size == 1 && queue.voiceChannel.members.first().id == client.user.id) {
//             distube.voices.leave(queue.textChannel.guild)
//             queue.textChannel.send(":cry: Odada yalnız başıma kalmaya dayanamadım ve odadan ayrıldım!");
//         }
//     }, 15 * 1000);
// });

fs.readdir("./commands/", function(err, files) {
    if(err) console.error(err);
    files.forEach(f => {
        if(f != "atatürk.js") {
            let props = require("./commands/" + f)

            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });

            console.log("Loaded " + f.replace(".js", "") + " command!")
        }
    });
});

let ____ = ["sa", "sea", "selamün aleyküm", "selamın aleyküm", "selamun aleyküm"]

let statuses = ["Görkemin yalanlarını", "YKS için /yks! | by Adnan Bey", "Şarkı çalmak için .play! | by Adnan Bey", "V1.5-DEV | by Adnan Bey"];

client.on("guildCreate", function(guild) {
    try {
        const channel = guild.systemChannel || guild.channels.cache.filter(c => c.type === "text")[0];

        let desc = [
            ":partying_face: **Beni sunucunuza davet ettiğiniz için teşekkürler**!",,
            "",
            "Bot komutlarına ulaşmak için '**/**' tuşuna bastıktan sonra sol taraftaki profil fotoğraflarından **" + client.user.username + "** olanı seçip tüm komutlara ulaşabilirsiniz!"
        ];

        let embed = new Discord.EmbedBuilder()
        .setDescription(desc.join("\n"))
        .setColor("White")

        if(channel) return channel.send({ embeds: [embed] });
        
        if(!channel) {
            try {
                let guildOwner = client.users.cache.get(guild.ownerId);
                guildOwner.send({ embeds: [embed] })
            } catch (e) {}
        } 
    } catch (e) {}
});

client.on("ready", function() {
    console.log("Logged in as " + client.user.tag)
    
    setInterval(() => {
        client.user.setStatus("dnd")

        let status = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setPresence({
            activities: [{ name: status, type: ActivityType.Listening }],
            status: 'dnd',
        });
    }, 5 * 1000);
});

client.on("messageCreate", function(msg) {
    if(msg.author.bot) return;
    if(!msg.guild) return msg.reply(":x: Komutları sadece sunucularda kullanabilirsiniz!");

    if(____.includes(msg.content.toLowerCase())) {
        if(msg.author.id == "305028936595800065") {
            return msg.reply("Sen sus siktir git lan, hoş geldin kardeşim.");
        } else if(msg.author.id == "524947415153770526" || msg.author.id == "398552472702025738") {
            return msg.reply(":saluting_face: Aleyküm selam lordum, hoş geldin.");
        } else {
            return msg.reply("Aleyküm selam kardeşim, hoş geldin.");
        }
    }

    if(msg.content.toLowerCase() == "günaydın" || msg.content.toLowerCase() == "güno") {
        if(msg.author.id == "524947415153770526" || msg.author.id == "398552472702025738") {
            return msg.reply(":sun_with_face: Günaydın efendim, kahvenizi şimdi mi alırsınız yoksa kahvaltıdan sonra mı?")
        } else {
            return msg.reply(":sun_with_face: Akşam oldu btw bu arada bu saatte uyanılır mı");
        }
    } else if(msg.content.toLowerCase() == "iyi geceler" || msg.content.toLowerCase() == "ig") {
        if(msg.author.id == "524947415153770526" || msg.author.id == "398552472702025738") {
            return msg.reply(":last_quarter_moon_with_face: İyi geceler efendim, tatlı rüyalar.")
        } else {
            return msg.reply(":last_quarter_moon_with_face: Ulan sabah oldu gece mi kaldı")
        }
    }

    if(!msg.content.startsWith(PREFIX)) return;

    let command = msg.content.toLocaleLowerCase().split(" ")[0].slice(PREFIX.length);
    let args = msg.content.split(" ").slice(1);
    let cmd;

    if(client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else {
        cmd = client.commands.get(client.aliases.get(command));
    }

    if(!cmd) return;

    if(cmd.conf.inDev != null && cmd.conf.inDev == true && msg.author.id != "524947415153770526") {
        let _msg = `:cry: Sn. ${"<@" + msg.author.id + ">"}, affınıza sığınarak bu komutun şu anda **geliştirilme aşamasında** olduğunu belirtmek isterim.`
        return msg.channel.send(_msg);
    }

    cmd.run(client, msg, args);

});

client.login(!config.DEVELOPMENT_MODE ? process.env.BOT_TOKEN : config.BOT_TOKEN_DEV)