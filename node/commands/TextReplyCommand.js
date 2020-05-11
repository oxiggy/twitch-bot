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

    async handle(client, channel, user, message) {
        if (message.toLowerCase().indexOf(this.options.trigger.toLowerCase()) !== 0) {
            return
        }
        if (!this.options.enabled) {
            return
        }
        const context = this.createContext(client, channel, user, message)
        if (this.options.condition !== undefined) {
            if (!this.evalCondition(this.options.condition, context)) {
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
            let probability
            if (variant.condition !== undefined) {
                if (!this.evalCondition(variant.condition, context)) {
                    continue
                }
            }
            probability = variant.probability !== undefined ? variant.probability : 1
            picker.option(variant, probability)
        }
        const reply = picker.pick()
        if (reply === null) {
            return true
        }
        await this.evalStatement(reply.statement, {
            ...context,
            say(text) {
                return client.say(channel, text)
            },
            wait(ms) {
                return new Promise(r => setTimeout(r, ms))
            },
        })
        return true
    }

    async evalCondition(condition, context) {
        return await safeEval(condition, context)
    }

    async evalStatement(statement, context) {
        if (Array.isArray(statement)) {
            for (const line of statement) {
                await safeEval(line, context)
            }
        } else {
            await safeEval(statement, context)
        }
    }

}
