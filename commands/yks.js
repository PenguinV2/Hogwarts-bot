const Discord = require('discord.js')

module.exports.run = async(client, message, args) => {
    let now = new Date().getTime();
    let TYT_TARIH_1 = new Date("2022/06/18 10:15:00").getTime();
    let AYT_TARIH_1 = new Date("2022/06/19 10:15:00").getTime();
    let TYT_TARIH = new Date("2023/06/18 10:15:00").getTime();
    let AYT_TARIH = new Date("2023/06/19 10:15:00").getTime();

    let TYT_DISTANCE = TYT_TARIH - now;
    let AYT_DISTANCE = AYT_TARIH - now;
    let TYT_DISTANCE_1 = now - TYT_TARIH_1;
    let AYT_DISTANCE_1 = now - AYT_TARIH_1;

    const tytData_1 = {
        days: Math.floor(TYT_DISTANCE_1 / (1000 * 60 * 60 * 24)),
        hours: Math.floor((TYT_DISTANCE_1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((TYT_DISTANCE_1 % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((TYT_DISTANCE_1 % (1000 * 60)) / 1000)
    };

    const aytData_1 = {
        days: Math.floor(AYT_DISTANCE_1 / (1000 * 60 * 60 * 24)),
        hours: Math.floor((AYT_DISTANCE_1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((AYT_DISTANCE_1 % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((AYT_DISTANCE_1 % (1000 * 60)) / 1000)
    };

    const tytData = {
        days: Math.floor(TYT_DISTANCE / (1000 * 60 * 60 * 24)),
        hours: Math.floor((TYT_DISTANCE % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((TYT_DISTANCE % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((TYT_DISTANCE % (1000 * 60)) / 1000)
    };

    let tytMessage = "";

    if (tytData.days > 0) {
        tytMessage += "**" + tytData.days + "** gün, ";
    }

    if (tytData.hours > 0) {
        tytMessage += "**" + tytData.hours + "** saat, ";
    }

    if (tytData.minutes > 0) {
        tytMessage += "**" + tytData.minutes + "** dakika, ";
    }

    if (tytData.seconds > 0) {
        tytMessage += "**" + tytData.seconds + "** saniye";
    }

    let tytMessage_1 = "";

    if (tytData_1.days > 0) {
        tytMessage_1 += "**" + tytData_1.days + "** gün, ";
    }

    if (tytData_1.hours > 0) {
        tytMessage_1 += "**" + tytData_1.hours + "** saat, ";
    }

    if (tytData_1.minutes > 0) {
        tytMessage_1 += "**" + tytData_1.minutes + "** dakika, ";
    }

    if (tytData_1.seconds > 0) {
        tytMessage_1 += "**" + tytData_1.seconds + "** saniye";
    }

    let aytMessage_1 = "";

    if (aytData_1.days > 0) {
        aytMessage_1 += "**" + aytData_1.days + "** gün, ";
    }

    if (aytData_1.hours > 0) {
        aytMessage_1 += "**" + aytData_1.hours + "** saat, ";
    }

    if (aytData_1.minutes > 0) {
        aytMessage_1 += "**" + aytData_1.minutes + "** dakika, ";
    }

    if (aytData_1.seconds > 0) {
        aytMessage_1 += "**" + aytData_1.seconds + "** saniye";
    }

    const aytData = {
        days: Math.floor(AYT_DISTANCE / (1000 * 60 * 60 * 24)),
        hours: Math.floor((AYT_DISTANCE % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((AYT_DISTANCE % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((AYT_DISTANCE % (1000 * 60)) / 1000)
    };

    let aytMessage = "";

    if (aytData.days > 0) {
        aytMessage += "**" + aytData.days + "** gün, ";
    }

    if (aytData.hours > 0) {
        aytMessage += "**" + aytData.hours + "** saat, ";
    }

    if (aytData.minutes > 0) {
        aytMessage += "**" + aytData.minutes + "** dakika, ";
    }

    if (aytData.seconds > 0) {
        aytMessage += "**" + aytData.seconds + "** saniye";
    }

    let MSU_TARIH_1 = new Date("2022/03/27 10:15:00").getTime();
    let MSU_TARIH = new Date("2023/04/2 10:15:00").getTime();

    let MSU_DISTANCE = MSU_TARIH - now;
    let MSU_DISTANCE_1 = now - MSU_TARIH_1;

    const msuData = {
        days: Math.floor(MSU_DISTANCE / (1000 * 60 * 60 * 24)),
        hours: Math.floor((MSU_DISTANCE % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((MSU_DISTANCE % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((MSU_DISTANCE % (1000 * 60)) / 1000)
    };

    let msuMessage = "";

    if (msuData.days > 0) {
        msuMessage += "**" + msuData.days + "** gün, ";
    }

    if (msuData.hours > 0) {
        msuMessage += "**" + msuData.hours + "** saat, ";
    }

    if (msuData.minutes > 0) {
        msuMessage += "**" + msuData.minutes + "** dakika, ";
    }

    if (msuData.seconds > 0) {
        msuMessage += "**" + msuData.seconds + "** saniye";
    }

    const msuData_1 = {
        days: Math.floor(MSU_DISTANCE_1 / (1000 * 60 * 60 * 24)),
        hours: Math.floor((MSU_DISTANCE_1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((MSU_DISTANCE_1 % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((MSU_DISTANCE_1 % (1000 * 60)) / 1000)
    };

    let msuMessage_1 = "";

    if (msuData_1.days > 0) {
        msuMessage_1 += "**" + msuData_1.days + "** gün, ";
    }

    if (msuData_1.hours > 0) {
        msuMessage_1 += "**" + msuData_1.hours + "** saat, ";
    }

    if (msuData_1.minutes > 0) {
        msuMessage_1 += "**" + msuData_1.minutes + "** dakika, ";
    }

    if (msuData_1.seconds > 0) {
        msuMessage_1 += "**" + msuData_1.seconds + "** saniye";
    }

    let msg = `**TYT-2022** biteli ${tytMessage_1} oldu.\n**AYT-2022** biteli ${aytMessage_1} oldu.\n**MSÜ-2022** biteli ${msuMessage_1} oldu.\n\n**TYT-2023**'e son ${tytMessage} kaldı.\n**AYT-2023**'e son ${aytMessage} kaldı.\n**MSÜ-2023**'e son ${msuMessage} kaldı.`

    message.channel.send(msg);
}

module.exports.conf = {
    aliases: ['sınav', 'sinav'], 
    permLevel: 0, 
    kategori: "Genel" 
};

module.exports.help = {
    name: 'yks', 
    description: '-', 
    usage: '-', 
};