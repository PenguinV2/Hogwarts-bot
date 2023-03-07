const { GatewayIntentBits, Partials, ActivityType, REST, Routes, ButtonStyle, AutoModerationRuleKeywordPresetType } = require("discord.js")
require("dotenv").config();
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

const { QuickDB } = require("quick.db")
const db = new QuickDB()

client.db = db;

global.client = client;

const fs = require("fs");
const config = require("./config.json");

let PREFIX = !config.DEVELOPMENT_MODE ? config.PREFIX : ".dev";

const { DisTube } = require('distube')
const { Player } = require("discord-player");
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { SpotifyPlugin } = require('@distube/spotify')

const path = require("path");
const resume = require("./slashcommands/müzik/resume");

const player = new Player(client);
client.player = player;

const distube = new DisTube(client, {
    leaveOnStop: true,
    leaveOnFinish: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    leaveOnEmpty: true,
    plugins: [
        new YtDlpPlugin(),
        new SpotifyPlugin({ emitEventsAfterFetching: false })
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

const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { min } = require("moment");

client.on("interactionCreate", async interaction => {
    if(!interaction.guild) return interaction.reply({ content: ":x: Komutları sadece sunucularda kullanabilirsiniz!" });

    // const nextFilter = i => i.customId == "nextButton";
    // const resumeFilter = i => i.customId == "resumeButton";
    // const seekFilter = i => i.customId == "seekButton";
    // const previousFilter = i => i.customId == "previousButton";
    // const pauseFilter = i => i.customId == "pauseButton";

    // const nextCollector = interaction.channel.createMessageComponentCollector({ filter: nextFilter });
    // const resumeCollector = interaction.channel.createMessageComponentCollector({ filter: resumeFilter });
    // const seekCollector = interaction.channel.createMessageComponentCollector({ filter: seekFilter });
    // const previousCollector = interaction.channel.createMessageComponentCollector({ filter: previousFilter });
    // const pauseCollector = interaction.channel.createMessageComponentCollector({ filter: pauseFilter });

    // nextCollector.on("collect", async function(i) {
    //     const queue = distube.getQueue(i);
    //     if(!queue) return await i.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

    //     try {
    //         await queue.skip().then(async () => {
    //             return await i.reply(":white_check_mark: Bir sonraki şarkıya geçiliyor.").then(() => {
    //                 setTimeout(async () => {
    //                     await i.deleteReply()
    //                 }, 1500);
    //             });
    //         })
    //     } catch (e) {
    //         if (e.message == "There is no up next song") {
    //             return await i.reply(`Sn. <@${interaction.member.id}>, ` + "bu şarkıyı geçebilmem için bundan sonra bir şarkı olması lazım değil mi güzel kardeşim? **Sıraya şarkı ekle ki geçebileyim**.")
    //         }
    //         console.error(e)
    //     }
    // });

    // resumeCollector.on("collect", async function(i) {
    //     const queue = client.distube.getQueue(i)
    //     if(!queue) return await i.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

    //     if(queue.paused) {
    //         client.distube.resume(i.guild.id);

    //         let newActionRowEmbeds = i.message.components.map(oldActionRow => {
    //             updatedActionRow = new ActionRowBuilder();
    //             updatedActionRow.addComponents(oldActionRow.components.map(buttonComponent => {
    //                 newButton = ButtonBuilder.from(buttonComponent)
    //                 if (i.component.customId == buttonComponent.customId) {
    //                     newButton.setEmoji("⏸️")
    //                     newButton.setCustomId("pauseButton")
    //                     newButton.setStyle(ButtonStyle.Danger)
    //                     newButton.setLabel("Şarkıyı duraklat")
    //                 }

    //                 return newButton
    //             }));

    //             return updatedActionRow
    //         });

    //         await i.update({ components: newActionRowEmbeds })
    //     } else {
    //         await i.reply(":x: Şarkı zaten durmamış!")
    //     }
    // });

    // seekCollector.on("collect", async function(i) {
    //     const queue = client.distube.getQueue(i)
    //     if(!queue) return await i.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

    //     try {
    //         queue.seek((queue.currentTime + 10))
    //         i.message.channel.send(":white_check_mark: **10 saniye** ileri sarıldı!").then(m => {
    //             setTimeout(async () => {
    //                 await m.delete()
    //             }, 5000);
    //         })
    //     } catch (e) {
    //         console.error(e)
    //     }
    // });

    // previousCollector.on("collect", async function(i) {
    //     const queue = client.distube.getQueue(i)
    //     if (!queue) return await i.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

    //     try {
    //         queue.previous()
    //     } catch (e) {
    //         if (e.message == "NO_PREVOUS") {
    //             return await i.reply(":x: Bundan önce bir şarkı çalmamış!")
    //         }
    //     }
    // });

    // pauseCollector.on("collect", async function(i) {
    //     const queue = client.distube.getQueue(i)
    //     if(!queue) return await i.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

    //     if(!queue.paused) {
    //         client.distube.pause(i.guild.id);

    //         let newActionRowEmbeds = i.message.components.map(oldActionRow => {
    //             updatedActionRow = new ActionRowBuilder();
    //             updatedActionRow.addComponents(oldActionRow.components.map(buttonComponent => {
    //                 newButton = ButtonBuilder.from(buttonComponent)
    //                 if (i.component.customId == buttonComponent.customId) {
    //                     newButton.setEmoji("▶️")
    //                     newButton.setCustomId("resumeButton")
    //                     newButton.setStyle(ButtonStyle.Success)
    //                     newButton.setLabel("Şarkıyı devam ettir")
    //                 }

    //                 return newButton
    //             }));

    //             return updatedActionRow
    //         });

    //         await i.update({ components: newActionRowEmbeds })
    //     } else {
    //         await i.reply(":x: Şarkı zaten durdurulmuş!")
    //     }
    // });

    if(interaction.isButton()) {
        let { customId } = interaction;
        if (customId == "nextButton") {
            const queue = distube.getQueue(interaction);
            if (!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

            try {
                await queue.skip().then(async () => {
                    return await interaction.reply(":white_check_mark: Bir sonraki şarkıya geçiliyor.").then(() => {
                        setTimeout(async () => {
                            try {
                                await interaction.deleteReply()
                            } catch(e) {}
                        }, 1500);
                    });
                })
            } catch (e) {
                if (e.message == "There is no up next song") {
                    return await interaction.reply(`Sn. <@${interaction.member.id}>, ` + "bu şarkıyı geçebilmem için bundan sonra bir şarkı olması lazım değil mi güzel kardeşim? **Sıraya şarkı ekle ki geçebileyim**.")
                }
                console.error(e)
            }
        } else if (customId == "pauseButton") {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

            if (!queue.paused) {
                client.distube.pause(interaction.guild.id);

                let newActionRowEmbeds = interaction.message.components.map(oldActionRow => {
                    updatedActionRow = new ActionRowBuilder();
                    updatedActionRow.addComponents(oldActionRow.components.map(buttonComponent => {
                        newButton = ButtonBuilder.from(buttonComponent)
                        if(interaction.component.customId == buttonComponent.customId) {
                            newButton.setEmoji("▶️")
                            newButton.setCustomId("resumeButton")
                            newButton.setStyle(ButtonStyle.Success)
                            newButton.setLabel("Şarkıyı devam ettir")
                        }

                        return newButton
                    }));

                    return updatedActionRow
                });

                await interaction.update({ components: newActionRowEmbeds })
            } else {
                await interaction.reply(":x: Şarkı zaten durdurulmuş!")
            }
        } else if (customId == "resumeButton") {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

            if (queue.paused) {
                client.distube.resume(interaction.guild.id);

                let newActionRowEmbeds = interaction.message.components.map(oldActionRow => {
                    updatedActionRow = new ActionRowBuilder();
                    updatedActionRow.addComponents(oldActionRow.components.map(buttonComponent => {
                        newButton = ButtonBuilder.from(buttonComponent)
                        if(interaction.component.customId == buttonComponent.customId) {
                            newButton.setEmoji("⏸️")
                            newButton.setCustomId("pauseButton")
                            newButton.setStyle(ButtonStyle.Danger)
                            newButton.setLabel("Şarkıyı duraklat")
                        }

                        return newButton
                    }));

                    return updatedActionRow
                });

                await interaction.update({ components: newActionRowEmbeds })
            } else {
                await interaction.reply(":x: Şarkı zaten durmamış!")
            }
        } else if (customId == "previousButton") {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

            queue.previous().then(async () => {
                await interaction.reply(":point_left: Bir önceki şarkıya geçildi.").then(() => {
                    setTimeout(async () => {
                        try {
                            await interaction.deleteReply()
                        } catch(e) {}
                    }, 10000);
                })
            }).catch(async () => {
                return await interaction.reply(":x: Bundan önce bir şarkı çalmamış!")
            });
        } else if (customId == "seekButton") {
            const queue = client.distube.getQueue(interaction)
            if (!queue) return await interaction.reply(`:x: Şu anda herhangi bir şarkı çalmıyor.`)

            try {
                queue.seek((queue.currentTime + 10))
                return await interaction.reply(":white_check_mark: **10 saniye** ileri sarıldı!").then(m => {
                    setTimeout(async () => {
                        try {
                            await interaction.deleteReply()
                        } catch(e) {}
                    }, 5000);
                })
            } catch (e) {
                console.error(e)
            }
        }
    } else if(interaction.isChatInputCommand()) {
        const command = interaction.client.slashCommands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            if (typeof (command.inDev) != undefined && !command.inDev) {
                await command.run(client, interaction);
            } else {
                if(interaction.member.id == "524947415153770526") {
                    await command.run(client, interaction);
                } else {
                    let _msg = `:cry: Sn. ${"<@" + interaction.member.id + ">"}, affınıza sığınarak bu komutun şu anda **geliştirilme aşamasında** olduğunu belirtmek isterim.`
                    await interaction.reply({ content: _msg, ephemeral: true });
                }
            }

            console.log(`/${command.data.name} used on guild ${interaction.guild.name}/${interaction.guildId} by ${client.users.cache.get(interaction.member.id).tag}/${interaction.member.id}`)
        } catch (error) {
            console.error("''" + error + "'' has occured while executing /" + interaction.commandName + " command on guild " + interaction.guild.name + "/" + interaction.guild.id);
        }
    } else {
        return;
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
    let button = new Discord.ButtonBuilder()
    .setStyle(ButtonStyle.Link)
    .setLabel(`${song.source.includes("youtube") ? "YouTube'da aç" : song.source.includes("twitch") ? "Twitch'te aç" : song.source.includes("spotify") ? "Spotify'da aç" : "Şarkıya git"}`)
    .setURL(song.url)

    let nextButton = new Discord.ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Sonraki şarkıya geç")
    .setEmoji("⏭️")
    .setCustomId("nextButton")

    let pauseButton = new Discord.ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel("Şarkıyı duraklat")
    .setEmoji("⏸️")
    .setCustomId("pauseButton")

    let previousButton = new Discord.ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Önceki şarkıya geç")
    .setEmoji("⏮️")
    .setCustomId("previousButton")

    let seekButton = new Discord.ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏩")
    .setLabel("10 saniye ileri sar")
    .setCustomId("seekButton")

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

        const row = new Discord.ActionRowBuilder().addComponents(previousButton, pauseButton, nextButton, seekButton, button)
        
        if(queue.lastEmbedId) {
            let __msg = queue.textChannel.messages.cache.get(queue.lastEmbedId)
            try {
                await __msg.delete()
            } catch(e) {}
            await queue.textChannel.send(({ embeds: [embed], components: [row] }) ).then(m => queue.lastEmbedId = m.id)
        } else {
            queue.textChannel.send({ embeds: [embed], components: [row] }).then(m => {
                queue.lastEmbedId = m.id
            })
        }

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

        if(queue.lastEmbedId) {
            let __msg = queue.textChannel.messages.cache.get(queue.lastEmbedId)
            try {
                await __msg.delete()
            } catch(e) {}
            await queue.textChannel.send(({ embeds: [embed], components: [row] }) ).then(m => queue.lastEmbedId = m.id)
        } else {
            queue.textChannel.send({ embeds: [embed] }).then(m => {
                queue.lastEmbedId = m.id
            })
        }
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
        { name: "Listedeki ilk şarkı", value: `**[${list.songs[0].name}](${list.songs[0].url})**`, inline: true },
        { name: "\u200b", value: "\u200b", inline: true },
        { name: "Oynatma listesindeki şarkı sayısı", value: "`" + list.songs.length + "`", inline: true }
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

let statuses = ["Görkemin yalanlarını", "YKS için /yks! | by Adnan Bey", "Şarkı çalmak için /play! | by Adnan Bey", "Kelime anlamları için /sözlük | by Adnan Bey"];

client.on("guildCreate", function(guild) {
    try {
        const channel = guild.systemChannel || guild.channels.cache.filter(c => c.type === "text")[0];

        let desc = [
            ":partying_face: **Beni sunucunuza davet ettiğiniz için teşekkürler**!",
            "",
            "Bot komutlarına ulaşmak için '**/**' tuşuna bastıktan sonra sol taraftaki profil fotoğraflarından **" + client.user.username + "** olanı seçmelisiniz!"
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

const secondsData = {}

client.on("messageCreate", async function(msg) {
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

    const calculate = function(secs) {
        secs = secs / 1000;
        let days = Math.floor(secs / 86400);
        let hours = Math.floor(secs / 3600);
        secs %= 3600;
        let minutes = Math.floor(secs / 60);
        let seconds = Math.floor(secs % 60);

        let text = "";

        if(days > 0) text += days + " gün, "
        if(hours > 0) text += hours + " saat, "
        if(minutes > 0) text += minutes + " dakika, "
        if(seconds > 0) text += seconds + " saniye"

        return text;
    }

    if(msg.content.toLocaleLowerCase() == ".süre") {
        let secondsData = await db.get(`${msg.author.id}.secondsData`);

        if(!secondsData) {
            return msg.reply(":x: Şu anda herhangi bir kanalda değilsin!");
        } else {
            let { joinedAt, channel, channelId } = secondsData;

            let description = [
                "Bulunduğun kanal: `" + channel + "`",
                "Sunucu: `" + client.channels.cache.get(channelId).guild.name + "`",
                "",
                "Kanalda aktif olduğun süre: `" + calculate(Date.now() - joinedAt) + "`",
            ];

            let embed = new Discord.EmbedBuilder()
            .setColor("White")
            .setDescription(description.join("\n"))
            .setThumbnail(client.channels.cache.get(channelId).guild.iconURL())

            return msg.reply({ embeds: [embed] })
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

const awaitingDeathGuilds = []

client.on("voiceStateUpdate", async function(oldState, newState) {
    if(!oldState.channel && newState.channel) {
        await db.set(`${newState.member.id}.secondsData`, { channel: newState.channel.name, joinedAt: Date.now(), channelId: newState.channel.id })
        //console.log(`${newState.member.user.tag} has joined ${newState.channel.name} channel on guild ${newState.guild.name}`)
    } else if(oldState.channel && !newState.channel) {
        //console.log(`${newState.member.user.tag} has left from ${oldState.channel.name} channel on guild ${oldState.guild.name}`)
        await db.delete(`${newState.member.id}.secondsData`);
    } else if(oldState.channel && newState.channel) {
        //console.log(`${newState.member.user.tag} has left from ${oldState.channel.name} channel and joined to ${newState.channel.name} on guild ${newState.guild.name}`)
        await db.set(`${newState.member.id}.secondsData`, { channel: newState.channel.name, joinedAt: Date.now(), channelId: newState.channel.id })
    }
});

setInterval(() => {
    client.guilds.cache.forEach(guild => {
        guild.members.cache.forEach(async member => {
            let secondsData = await db.get(`${member.id}.secondsData`)
            if (!secondsData && member.voice.channel) {
                await db.set(`${member.id}.secondsData`, { channel: member.voice.channel.name, joinedAt: Date.now(), channelId: member.voice.channel.id }).then(() => {
                    console.log(`Added ${member.user.tag} to time database!`)
                });
            }
        });
    });
});

// BOTU BAŞKA BİR KANALA ATTIĞIMDA BU ÇALIŞMIYOR

// client.on("voiceStateUpdate", function(oldState, newState) {
//     const oldChannel = oldState.channel;
//     const newChannel = newState.channel;
//     if(!oldChannel || !newChannel) return;

//     const isAlone = oldChannel.members.size === 1 && oldChannel.members.has(client.user.id);
//     const isAloneAt = isAlone ? "old" : "new"

//     if(awaitingDeathGuilds.includes(oldChannel.guild.id)) {
//         const player = distube.getQueue(oldChannel.guild.id);

//         if(player) {
//             player.textChannel.send(`:tada: Odaya biri katıldığı için şarkıyı devam ettiriyorum!`).then(m => {
//                 setTimeout(async () => {
//                     try { m.delete() } catch (e) {}
//                 }, 5000);
//             });
//             try { player.resume() } catch (e) {}
    
//             for (let i = 0; i < awaitingDeathGuilds.length; i++) {
//                 if (awaitingDeathGuilds[i] === oldChannel.guild.id) {
//                     awaitingDeathGuilds.splice(i, 1);
//                 }
//             }
//         }
//     } else {
//         if(isAlone) {
//             const player = distube.getQueue(oldChannel.guild.id);
//             if(player) {
//                 player.textChannel.send(`:thinking: **${oldChannel.name}** kanalından **30 saniye** içinde ayrılacağım çünkü burada tek başıma kaldım.`).then(m => {
//                     setTimeout(async () => {
//                         try { m.delete() } catch (e) {}
//                     }, 10000);
//                 });
//                 try { player.pause() } catch (e) {}
//                 awaitingDeathGuilds.push(oldChannel.guild.id);
//                 setTimeout(() => {
//                     const isStillAlone = oldChannel.members.size === 1 && oldChannel.members.has(client.user.id);
//                     if(isStillAlone) {
//                         player.textChannel.send(`:cry: **${oldChannel.name}** kanalında tek başıma kalmaya dayanamadım ve odadan ayrıldım.`).then(m => {
//                             setTimeout(async () => {
//                                 try { m.delete() } catch (e) {}
//                             }, 5000);
//                         });
//                         distube.voices.leave(oldChannel.guild.id)

//                         for (let i = 0; i < awaitingDeathGuilds.length; i++) {
//                             if (awaitingDeathGuilds[i] === oldChannel.guild.id) {
//                                 awaitingDeathGuilds.splice(i, 1);
//                             }
//                         }
//                     }
//                 }, 30 * 1000);
//             }
//         }
//     }
// });

client.login(!config.DEVELOPMENT_MODE ? process.env.BOT_TOKEN : config.BOT_TOKEN_DEV)

const express = require("express");
const app = express()

app.get("/", function(req, res) {
    res.status(200).send("Hello world!")
});

app.get("/ping", function(req, res) {
    res.status(200).send("Pong!")
});

app.listen(process.env.PORT ? process.env.PORT : 3000, () => console.log("[EXPRESS] Hogwarts Bot is alive!"))
