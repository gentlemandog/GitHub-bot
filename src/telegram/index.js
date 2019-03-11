import TelegramBot from 'node-telegram-bot-api'
import Message from './message'

class Telegram {
    constructor (tg_token) {
        this.tg_chat_room = []
        this.bot = new TelegramBot(tg_token, {polling: true})
        this.bot.on('message', (msg) => this.onMessage(msg))
        this.bot.on("polling_error", (msg) => console.error(msg));
    }

    forwardFromGH (text, options) {
        this.tg_chat_room.forEach((each) => {
            this.bot.sendMessage(each, text, options)
        })
    }

    onMessage (msg) {
        const message = new Message(msg)
        if (message.isBotCommand()) {
            this.onCommand(message)
        } else {
            // this.bot.sendMessage(message.chat.id, 'asdasdasdasdsa')
        }
    }

    onCommand (msg) {
        let entities = msg.entities[0]
        if (entities.offset === 0) {
            let cmd_name = msg.text.slice(entities.offset + 1, entities.length)
            if (cmd_name === 'ping') {
                this.bot.sendMessage(msg.chat.id, 'Pong!')
            } else if (cmd_name === 'bind') {
                this.tg_chat_room.push(msg.chat.id)
                this.bot.sendMessage(msg.chat.id, 'Binded!')
            }
        }
    }
}

export default Telegram
