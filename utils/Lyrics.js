const cheerio = require('cheerio');
const axios = require('axios').default;
const config = require("../config.json")
require("dotenv").config()
const ACCESS_TOKEN = !config.DEVELOPMENT_MODE ? process.env.GENIUS_ACCESS_TOKEN : config.GENIUS_ACCESS_TOKEN;
const MUSIXMATCH_KEY = process.env.MUSIXMATCH_KEY;

const cloudscraper = require("cloudscraper");

class Lyrics {

    static async scrapeLyrics(url) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await cloudscraper.get({ uri: url });
                const body = await response;
                setTimeout(() => {
                    const $ = cheerio.load(body);
                    let lyrics = $('div[class="lyrics"]').text().trim();
                    if (!lyrics) {
                        lyrics = '';
                        $('div[class^="Lyrics__Container"]').each((i, elem) => {
                            if ($(elem).text().length !== 0) {
                                let snippet = $(elem)
                                    .html()
                                    .replace(/<br>/g, '\n')
                                    .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                                lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
                            }
                        });
                    }
                    if (!lyrics) return null;

                    resolve(lyrics.trim());
                }, 5000);
            } catch (e) { console.log("There was an error while scraping lyrics.", e.message) } 
        });
    }

    static async getLyrics(path) {
        return new Promise((resolve, reject) => {
            try {
                axios.get(`https://api.genius.com/${path}`, { headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` } }).then(response => {
                    if(response.status !== 200) reject("NO_RESPONSE");

                    try {
                        const data = response.data.response.hits[0];
                        if(!data) reject("NO_SONG_FOUND");

                        const songData = [];

                        const picture = data.result.song_art_image_thumbnail_url;
                        const extendedsong = data.result.title_with_featured;
                        const artist = data.result.primary_artist.name;

                        const lyricsURL = data.result.url;
                        console.log(lyricsURL)

                        this.scrapeLyrics(lyricsURL).then(lyrics => {
                            songData.push({
                                picture: picture,
                                extendedsong: extendedsong,
                                artist: artist,
                                lyricsURL: lyricsURL,
                                lyrics
                            });

                            resolve(songData);
                        });
                    } catch (e) {
                        reject("NO_RESPONSE")
                    }
                });
            } catch (e) { console.log("There was an error while getting lyrics.") }
        });
    }
}

module.exports = Lyrics;