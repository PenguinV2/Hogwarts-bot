const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

function getWordData(kelime) {
    return new Promise((resolve, reject) => {
        const request = require('request');
        try {
            request(`https://sozluk.gov.tr/gts?ara=${kelime}`, function(err, resp, body) {
                if(err) return reject(err);

                const _data = JSON.parse(body);
                if(_data.error && _data.error === "Sonuç bulunamadı") return reject("ERROR");

                const data = _data[0];

                if(resp.statusCode == 200) {
                    let lisan = data.lisan;
                    let telaffuz = data.telaffuz;
                    let madde = data.madde;

                    const wordData = [];

                    const anlamlar = [];
                    const ozellikler = [];
                    const ornekler = [];

                    for(let i = 0; i < data.anlamlarListe.length; i++) {
                        anlamlar.push(data.anlamlarListe[i].anlam);

                        if(data.anlamlarListe[i].ozelliklerListe && data.anlamlarListe[i].ozelliklerListe.length >= 1) {
                            for(let x = 0; x < data.anlamlarListe[i].ozelliklerListe.length; x++) {
                                ozellikler.push(data.anlamlarListe[i].ozelliklerListe[x].tam_adi);
                            }
                        } 

                        if(data.anlamlarListe[i].orneklerListe && data.anlamlarListe[i].orneklerListe.length >= 1) {
                            for(let x = 0; x < data.anlamlarListe[i].orneklerListe.length; x++) {
                                var yazar;

                                try {
                                    yazar = data.anlamlarListe[i].orneklerListe[x] ? data.anlamlarListe[i].orneklerListe[x].yazar[0] ? data.anlamlarListe[i].orneklerListe[x].yazar[0].tam_adi : null : null;
                                } catch(e) {
                                    yazar = null;
                                }

                                ornekler.push({ ornek: data.anlamlarListe[i].orneklerListe[x].ornek, yazar: yazar });

                                if(yazar === null || yazar === undefined) break;
                            }
                        } 
                    }

                    wordData.push({ lisan: lisan, telaffuz: telaffuz, madde: madde, anlamlar: anlamlar, ozellikler: ozellikler, ornekler: ornekler });
                    return resolve(wordData);
                } else {
                    return reject(err);
                }
            });
        } catch (e) {
            return reject(e);
        }
    });
}

module.exports = {
    data: new SlashCommandBuilder().setName("sözlük").setDescription("Belirtilen kelimenin anlamını gösterir.")
        .addStringOption(option => option.setName("kelime").setRequired(true).setDescription("Lütfen kelmeyi belirtin.")),
	run: async(client, interaction) => {
        let kelime = interaction.options.getString("kelime")

        getWordData(encodeURIComponent(kelime)).then(async _data => {
            const data = _data[0];

            let embedTitle;

            var telaffuzNull = data.telaffuz == null || " " || "";
            var lisanNull = data.lisan == "" || data.lisan.length === 0;

            embedTitle = data.madde;

            if(telaffuzNull == false) {
                embedTitle += " **(" + data.telaffuz.replace("<b>", "*").replace("</b>", "*")/*.replace(/<[^>]*>?/gm, "")*/ + ")**";
            }

            if(lisanNull == false) {
                embedTitle += ", *" + data.lisan + "*";
            }

            let description = "";

            for(let i = 0; i < data.anlamlar.length; i++) {
                let ozellik = data.ozellikler[i];
                let ornek = data.ornekler[i];

                description += `**${i+1}.** *${data.anlamlar[i]}*`;
                if(ozellik !== undefined) {
                    description += ` ***${ozellik}***\n`;
                } else {
                    description += "\n";
                }

                if(ornek !== undefined) {
                    description += `__${ornek.ornek}__${ornek.yazar != null ? '\n***-*** ' + ornek.yazar: ''}\n\n`
                } else {
                    description += "\n";
                }
            }

            let embed = new Discord.EmbedBuilder()
            .setDescription(embedTitle + "\n\n" + description).setColor('#FEFF01')
            .setFooter({ text: 'Veriler, Türk Dil Kurumu\'ndan alınmaktadır!', iconURL: 'https://www.antalyasigorta.com/wp-content/uploads/2017/02/v4seknva5wmk1k8k73aj.jpg' })

            return await interaction.reply({ embeds: [embed] });
        }).catch(async (e) => {
            return await interaction.reply(":x: Bir hata oluştu! Lütfen daha sonra tekrar deneyin. ***Belirtilen kelimeyi doğru girdiğinizden emin olun.***");
        });
    }
}