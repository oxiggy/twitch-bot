const tmi = require('tmi.js')
const Firebase = require('firebase-admin')
const UsersService = require('./services/UsersService')
const TextReplyCommand = require('./commands/TextReplyCommand')

const { BOT_USERNAME, BOT_TOKEN, BOT_CHANNELS, FIREBASE_DATABASE_URL, FIREBASE_SERVICE_ACCOUNT } = process.env

const firebase = Firebase.initializeApp({
    credential: Firebase.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: FIREBASE_DATABASE_URL,
})
const firestore = firebase.firestore()

const usersService = new UsersService

let COMMANDS = []

firestore
    .collection('bot')
    .doc('twitch')
    .collection('command')
    .onSnapshot(snapshot => {
        COMMANDS = []
        snapshot.forEach(doc => {
            const commandOptions= doc.data()
            let commandClass
            switch (commandOptions.type) {
                case 'text-reply': {
                    commandClass= TextReplyCommand
                    break
                }
                default: {
                    commandClass = null
                }
            }
            if (commandClass) {
                COMMANDS.push(new TextReplyCommand(commandOptions, {
                    usersService
                }))
            }
        })
    })
;

const options = {
    identity: {
        username: BOT_USERNAME,
        password: BOT_TOKEN,
    },
    channels: JSON.parse(BOT_CHANNELS),
}

const client = new tmi.client(options)

client.on('join', onJoin)
client.on('part', onPart)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

client.connect()

// User has joined a channel. Not available on large channels and is also sent in batch every 30 - 60 secs.
function onJoin(channel, username, self) {
    usersService.fetchChatters(channel)
}

// User has left a channel
function onPart(channel, username, self) {
    usersService.fetchChatters(channel)
}

// Called every time a message comes in
function onMessageHandler(channel, context, message, self) {
    if (self) return

    message = message.trim()
    if (message.indexOf('!') === 0) { // сообщение является командой
        for (const command of COMMANDS) {
            if (command.handle(client, channel, context, message)) {
                break
            }
        }
    }
}

function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
    for (const channel of options.channels) {
        usersService.fetchChatters(channel)
    }
}
