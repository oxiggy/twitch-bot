const request = require('request-promise')

module.exports = class UsersService {

    constructor() {
        this.infoByChannel = {}
    }

    async fetchChatters(channel) {
        try {
            const res = await request({
                url: `https://tmi.twitch.tv/group/user/${channel.replace(/^#/, '')}/chatters`,
                json: true
            })
            this.infoByChannel[channel] = {
                chatterCount: res.chatter_count,
                chatters: res.chatters,
            }
        } catch (error) {
            console.error(error)
        }
    }

    getUsernames(channel) {
        const info = this.infoByChannel[channel]
        return [
            ...info.chatters.broadcaster,
            ...info.chatters.vips,
            ...info.chatters.moderators,
            ...info.chatters.staff,
            ...info.chatters.admins,
            ...info.chatters.global_mods,
            ...info.chatters.viewers
        ]
    }

    getRandomUsername(channel) {
        const usernames = this.getUsernames(channel)
        const i = Math.floor(Math.random() * usernames.length)
        return usernames[i]
    }

    isUsername(channel, username) {
        const usernames = this.getUsernames(channel)
        username = username.replace(/^@/, '')
        return usernames.indexOf(username) > -1
    }

}
