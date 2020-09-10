const axios = require("axios");
const Discord = require('discord.js');

const channels = require('../channels.json');

const news = require('./news.js');
const shop = require('./shop.js')

module.exports = {
    async reloadData(bot) {
        axios({
            method: 'get',
            url: 'https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game',
            headers: { 
                'Accept-Language': 'fr-FR', 
            }
        }).then(async function(response) {
            if(response.status !== 200) return
            
            let channel = bot.channels.cache.get(channels.battleroyalenews)
            if(response.data.battleroyalenewsv2["jcr:baseVersion"] !== channel.topic && response.data.battleroyalenewsv2.news.motds.length !== 0) {
                await news.generateNewsBR(response.data.battleroyalenewsv2).then(async (value) => {
                    let embed = new Discord.MessageEmbed()
                    .setTitle("Actualités Battle Royale")
                    .setColor('#bf9322')
                    .attachFiles(value)
                    .setImage('attachment://br-news.gif')
                    .setFooter(response.data.battleroyalenewsv2["jcr:baseVersion"], bot.user.displayAvatarURL())
                    await channel.send(embed).then(message => {
                        axios({
                            method: 'post',
                            url: `https://discord.com/api/v6/channels/${channel.id}/messages/${message.id}/crosspost`,
                            headers: {
                                "Authorization" : `Bot ${process.env.discordToken}`
                            }
                        })
                    })
                    await channel.setTopic(response.data.battleroyalenewsv2["jcr:baseVersion"])
                })
            }

            channel = bot.channels.cache.get(channels.creativenews)
            if(response.data.creativenewsv2["jcr:baseVersion"] !== channel.topic && response.data.creativenewsv2.news.motds.length !== 0) {
                await news.generateNewsCreatif(response.data.creativenewsv2).then(async (value) => {
                    let embed = new Discord.MessageEmbed()
                    .setTitle("Actualités Fortnite Créatif")
                    .setColor('#bf9322')
                    .attachFiles(value)
                    .setImage('attachment://creatif-news.gif')
                    .setFooter(response.data.creativenewsv2["jcr:baseVersion"], bot.user.displayAvatarURL())
                    await channel.send(embed).then(message => {
                        axios({
                            method: 'post',
                            url: `https://discord.com/api/v6/channels/${channel.id}/messages/${message.id}/crosspost`,
                            headers: {
                                "Authorization" : `Bot ${process.env.discordToken}`
                            }
                        })
                    })
                    await channel.setTopic(response.data.creativenewsv2["jcr:baseVersion"])
                })
            }

            channel = bot.channels.cache.get(channels.savetheworldnews)
            if(response.data.savetheworldnews["jcr:baseVersion"] !== channel.topic && response.data.savetheworldnews.news.messages.length !== 0) {
                await news.generateNewsSTW(response.data.savetheworldnews).then(async (value) => {
                    let embed = new Discord.MessageEmbed()
                    .setTitle("Actualités Fortnite Sauver le Monde")
                    .setColor('#bf9322')
                    .attachFiles(value)
                    .setImage('attachment://stw-news.gif')
                    .setFooter(response.data.savetheworldnews["jcr:baseVersion"], bot.user.displayAvatarURL())
                    await channel.send(embed).then(message => {
                        axios({
                            method: 'post',
                            url: `https://discord.com/api/v6/channels/${channel.id}/messages/${message.id}/crosspost`,
                            headers: {
                                "Authorization" : `Bot ${process.env.discordToken}`
                            }
                        })
                    })
                    await channel.setTopic(response.data.savetheworldnews["jcr:baseVersion"])
                })
            }
            
            await news.emergencyMessage(bot, response.data.emergencynotice)
            return
        })
    },

    async reloadShop(bot) {
        const channel = bot.channels.cache.get(channels.shop)
        axios({
            method: 'get',
            url: 'https://fortnite-api.com/v2/shop/br/combined?language=fr',
        }).then(async function(response) {
            if(response.status !== 200) return
            if(response.data.data.hash === channel.topic) return 
            await shop.genratateShop(response.data.data).then(async (value) => {
                let embed = new Discord.MessageEmbed()
                .setTitle(`Shop Fortnite Battle Royale`)
                .attachFiles(value)
                .setImage("attachment://shop.png")
                .setColor("#bf9322")
                .setFooter(response.data.data.hash, bot.user.displayAvatarURL())
                await channel.send(embed).then(message => {
                    axios({
                        method: 'post',
                        url: `https://discord.com/api/v6/channels/${channel.id}/messages/${message.id}/crosspost`,
                        headers: {
                            "Authorization" : `Bot ${process.env.discordToken}`
                        }
                    })
                })
            })
            return await channel.setTopic(response.data.data.hash)
        })
    },
}
