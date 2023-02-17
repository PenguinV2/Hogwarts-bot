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

let PREFIX = config.PREFIX;

const { DisTube, default: dist } = require('distube')
const { Player } = require("discord-player");
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { SpotifyPlugin } = require('@distube/spotify')

const path = require("path")

const player = new Player(client);
client.player = player;
const distube = new DisTube(client, {
    leaveOnStop: false,
    leaveOnFinish: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new YtDlpPlugin(),
        new SpotifyPlugin({ emitEventsAfterFetching: true })
    ]
});

client.slashCommands = new Discord.Collection();

const slashcCommandsPath = path.join(__dirname, 'slashcommands');
const slashCommandFiles = fs.readdirSync(slashcCommandsPath).filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
	const filePath = path.join(slashcCommandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command) {
		client.slashCommands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" property.`);
	}
}

let _slashCommands = [];
const __commandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));

for(const f of __commandFiles) {
    const command = require(`./slashcommands/${f}`);
	_slashCommands.push(command.data.toJSON());
}

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.slashCommands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.run(client, interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

(async () => {
	try {
		const data = await rest.put(Routes.applicationCommands("1075585526775689226"), { body: _slashCommands });

		console.log(`${data.length} '/' komutu aktif!`);
	} catch (error) {
		console.error(error);
	}
})();

client.distube = distube;

distube.on("playSong", function(queue, song) {
    queue.textChannel.send(":notes: Çalıyor: **" + song.name + "** (" + song.formattedDuration + ") | *<@" + song.member.id + "> tarafından istendi.*")
});

distube.on("addSong", function(queue, song) { 
    queue.textChannel.send(":white_check_mark: Sıraya eklendi: **" + song.name + "** (" + song.formattedDuration + ")")
});

distube.on("finish", function(queue) {
    queue.textChannel.send(":stopwatch: **TIME'S UP**! Ado's multipurpose bot has left from the voice channel!");
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

let statuses = ["Görkemin yalanlarını", "YKS için .yks! | by Adnan Bey", "Şarkı çalmak için .play! | by Adnan Bey", "V1.0-DEV | by Adnan Bey"];

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

client.login(config.BOT_TOKEN)