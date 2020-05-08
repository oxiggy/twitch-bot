const { Picker } = require('random-picker')
const safeEval = require('notevil')

module.exports = class TextReplyCommand {

    constructor(options, { usersService }) {
        this.options = options
        this.usersService = usersService
    }

    exec(client, channel, user, message) {
        if (!this.options.enabled) {
            return
        }

        const args = message.replace(this.options.trigger, '').trim().split(/\s+/).filter((arg) => arg !== '')
        const context = {
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

        if (this.options.condition) {
            const result = safeEval(this.options.condition, context)
            if (!result) {
                return
            }
        }

        if (this.options.cooldown) {
            // @todo
        }

        if (!Array.isArray(this.options.replyVariants)) {
            return
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
    }

}
