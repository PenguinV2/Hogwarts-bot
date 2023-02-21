const Discord = require('discord.js')
const request = require("request")
const { SlashCommandBuilder } = require("discord.js");

const TARIHLER = {
    TYT_TARIH: "2023/06/18 10:15:00",
    AYT_TARIH: "2023/06/19 10:15:00",
    MSU_TARIH: "2023/04/02 10:15:00",
    DGS_TARIH: "2023/07/16 10:15:00",
}

const months = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs",
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül",
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık"
}

function calculate(distance) {
    return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
}

function toFixed(tarih) {
    let __1 = tarih.split(" ")[0];
    let __2 = __1.split("/")[2] + " " + months[__1.split("/")[1]] + " " + __1.split("/")[0];
    let __3 = tarih.split(" ")[1];
    let __4 = __3.split(":")[0] + ":" + __3.split(":")[1];

    return "`" + __2 + " " + __4 + "`";
}

module.exports = {
    data: new SlashCommandBuilder().setName("yks").setDescription("YÖK'ün yapacağı sınavlara ne kadar süre kaldığını gösterir."),
	run: async(client, interaction) => {
        let now = new Date().getTime();

        let __tyt = new Date(TARIHLER["TYT_TARIH"]).getTime() - now;
        let __ayt = new Date(TARIHLER["AYT_TARIH"]).getTime() - now;
        let __msu = new Date(TARIHLER["MSU_TARIH"]).getTime() - now;
        let __dgs = new Date(TARIHLER["DGS_TARIH"]).getTime() - now;

        let tytCalculated = calculate(__tyt);
        let aytCalculated = calculate(__ayt);
        let msuCalculated = calculate(__msu);
        let dgsCalculated = calculate(__dgs);

        let tytMessage = "";
        if(tytCalculated.days > 0) tytMessage += `**${tytCalculated.days}** gün, `
        if(tytCalculated.hours > 0) tytMessage += `**${tytCalculated.hours}** saat, `
        if(tytCalculated.minutes > 0) tytMessage += `**${tytCalculated.minutes}** dakika, `
        if(tytCalculated.seconds > 0) tytMessage += `**${tytCalculated.seconds}** saniye`

        let aytMessage = "";
        if(aytCalculated.days > 0) aytMessage += `**${aytCalculated.days}** gün, `
        if(aytCalculated.hours > 0) aytMessage += `**${aytCalculated.hours}** saat, `
        if(aytCalculated.minutes > 0) aytMessage += `**${aytCalculated.minutes}** dakika, `
        if(aytCalculated.seconds > 0) aytMessage += `**${aytCalculated.seconds}** saniye`

        let msuMessage = "";
        if(msuCalculated.days > 0) msuMessage += `**${msuCalculated.days}** gün, `
        if(msuCalculated.hours > 0) msuMessage += `**${msuCalculated.hours}** saat, `
        if(msuCalculated.minutes > 0) msuMessage += `**${msuCalculated.minutes}** dakika, `
        if(msuCalculated.seconds > 0) msuMessage += `**${msuCalculated.seconds}** saniye`

        let dgsMessage = "";
        if(dgsCalculated.days > 0) dgsMessage += `**${dgsCalculated.days}** gün, `
        if(dgsCalculated.hours > 0) dgsMessage += `**${dgsCalculated.hours}** saat, `
        if(dgsCalculated.minutes > 0) dgsMessage += `**${dgsCalculated.minutes}** dakika, `
        if(dgsCalculated.seconds > 0) dgsMessage += `**${dgsCalculated.seconds}** saniye`

        let _msgs = [
            `**TYT-2023**'e son ${tytMessage} kaldı. | ${toFixed(TARIHLER["TYT_TARIH"])}`,
            `**AYT-2023**'e son ${aytMessage} kaldı. | ${toFixed(TARIHLER["AYT_TARIH"])}`,
            `**DGS-2023**'e son ${dgsMessage} kaldı. | ${toFixed(TARIHLER["DGS_TARIH"])}`,
            `**MSÜ-2023**'e son ${msuMessage} kaldı. | ${toFixed(TARIHLER["MSU_TARIH"])}`,
        ];

        await interaction.reply(_msgs.join("\n"));
    }
}