const { Picker }= require('random-picker')

module.exports = class TextReplyCommand {

    constructor(options) {
        this.options = options
    }

    exec(client, target, context, message) {
        const picker = new Picker
        for (const reply of this.options.replies) {
            let replyText
            let replyProbability
            if (typeof reply === 'string') {
                replyText = reply
                replyProbability = 1
            } else {
                replyText = reply.text
                replyProbability = reply.probability !== undefined ? reply.probability : 1
            }
            picker.option(replyText, replyProbability)
        }
        const replyText = picker.pick()
        client.say(target, replyText)
    }

}
