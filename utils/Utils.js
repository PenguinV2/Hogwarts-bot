const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

class Utils {

    static secondsToTime(seconds) {
        var formattedDuration = moment.duration(seconds, "seconds").format("dd:hh:mm:ss", { trim: false });
        
        if(formattedDuration.split(":")[0] === "00") {
            formattedDuration = formattedDuration.slice(3);
        }

        if(formattedDuration.split(":")[0] === "00") {
            formattedDuration = formattedDuration.slice(3);
        }
        
        return formattedDuration;   
    }

    static millisecondsToTime(milliseconds) {
        var formattedDuration = moment.duration(milliseconds, "milliseconds").format("dd:hh:mm:ss", { trim: false });
        
        if(formattedDuration.split(":")[0] === "00") {
            formattedDuration = formattedDuration.slice(3);
        }

        if(formattedDuration.split(":")[0] === "00") {
            formattedDuration = formattedDuration.slice(3);
        }
        
        return formattedDuration;  
    }

    static postToHastebin(data) {
        const https = require('https');

        return new Promise((resolve, reject) => {
            if(!data) reject("Lütfen bir veri girin!");

            const request = https.request({
                host: "hastebin.com",
                path: "/documents",
                method: "POST",
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Content-Length": Buffer.byteLength(data)
                }
            });

            request.once("response", function(res) {
                const body = [];

                res.on("data", function(chunk) {
                    body.push(chunk);
                });

                res.on("error", function(error) {
                    reject(error);
                })

                res.on("end", function() {
                    const key = JSON.parse(Buffer.concat(body)).key;
                    return resolve(`https://hastebin.com/${key}`);
                });
            });

            request.once("error", function(error) {
                reject(error);
            })

            return request.end(data);
        });
    }

    static paginate(items, page = 1, pageLength = 10) {
        const maxPage = Math.ceil(items.length / pageLength);
        if(page < 1) page = 1;
        if(page > maxPage) page = maxPage;
        const startIndex = (page - 1) * pageLength;
        return {
            items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
            page,
            maxPage,
            pageLength
        };
    };
}

module.exports = Utils;