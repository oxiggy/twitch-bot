const tmi = require('tmi.js')
const Firebase= require('firebase-admin')

const { BOT_USERNAME, BOT_TOKEN, BOT_CHANNELS, FIREBASE_DATABASE_URL, FIREBASE_SERVICE_ACCOUNT } = process.env

const firebase = Firebase.initializeApp({
    credential: Firebase.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT)),
    databaseURL: FIREBASE_DATABASE_URL,
})
const firestore = firebase.firestore()

let CONFIG = {}

firestore
    .collection('bot')
    .doc('twitch')
    .collection('command')
    .onSnapshot(snapshot => {
        CONFIG.commands = []
        snapshot.forEach(doc => {
            CONFIG.commands.push(doc.data())
        })
    })
;

const options = {
    identity: {
        username: BOT_USERNAME,
        password: BOT_TOKEN,
    },
    channels: JSON.parse(BOT_CHANNELS),
};

const client = new tmi.client(options)

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

const TextReplyCommand = require('./commands/TextReplyCommand')

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) { return }
    if (!CONFIG && !CONFIG.commands) return

    const commandName = msg.trim()

    let commandOptions = null
    for (const command of CONFIG.commands) {
        if (command.token === commandName) {
            commandOptions = command
            break
        }
    }
    let command
    if (commandOptions) {
        switch (commandOptions.type) {
            case 'text-reply': {
                command = new TextReplyCommand(commandOptions)
                break
            }
            default: {
                command = null
            }
        }
    }
    if (command) {
        command.exec(client, target, context)
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
