const { Picker } = require('random-picker')
const safeEval = require('safe-eval')

module.exports = class TextReplyCommand {

    constructor(options, { usersService }) {
        this.options = options
        this.usersService = usersService
    }

    createContext(client, channel, user, message) {
        const args = message.replace(this.options.trigger, '').trim().split(/\s+/).filter((arg) => arg !== '')
        return {
            args,
            user,
            Users: {
                getRandomUsername: () => {
                    return this.usersService.getRandomUsername(channel)
                },
                isUsername: (username) => {
                    return this.usersService.isUsername(channel, username)
                },
            }
        }
    }

    handle(client, channel, user, message) {
        if (message.toLowerCase().indexOf(this.options.trigger.toLowerCase()) !== 0) {
            return
        }
        if (!this.options.enabled) {
            return
        }
        const context = this.createContext(client, channel, user, message)
        if (this.options.condition !== undefined) {
            if (!safeEval(this.options.condition, context)) {
                return
            }
        }
        if (this.options.cooldown) {
            // @todo
        }
        if (!Array.isArray(this.options.replyVariants)) {
            return true
        }
        const picker = new Picker
        for (const variant of this.options.replyVariants) {
            let reply
            let replyProbability
            if (variant.condition !== undefined) {
                const result = safeEval(this.options.condition, context)
                if (!result) {
                    continue
                }
            }
            reply = variant.reply
            replyProbability = variant.probability !== undefined ? variant.probability : 1
            picker.option(reply, replyProbability)
        }
        const reply = picker.pick()
        const replyText = safeEval(reply, context)
        client.say(channel, replyText)
        return true
    }

}
