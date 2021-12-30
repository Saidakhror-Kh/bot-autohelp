/* sasasasa~ */





const TelegramApi = require('node-telegram-bot-api')
const { options } = require('nodemon/lib/config')
const token = '5026585404:AAGnE9wniFFs5XKo4vq-oLm9D8HayhtohNk'
const bot = new TelegramApi(token,{polling: true})
const {gameOptions, againOptions} = require('./options')
const chats = {}

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, "now bot will generate number from 0 to 9, try to find this number")
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `answer ${chats[chatId]}`)
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () =>{
    bot.setMyCommands([
        {command: '/start', description:'Начало работы бота'},
        {command: '/info', description:'получить информацию о боте'},
        {command: '/game', description:'бот игра'}
    ])
    
    bot.on('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg);
        if (text === '/start'){
            
           await bot.sendSticker(chatId, 'CAACAgIAAxkBAANbYcwvbLYqumWbEYT2B1Gh1U_kIM0AAkwAA8OaZCnuwnhKg_sC2SME' )
           return bot.sendMessage(chatId, `Добро пожаловать!`)
        }
        if (text=== '/info'){
            if (msg.from.last_name === undefined){
               return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
            }
            else{
               return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
            }
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, у меня нет такой команды')
    })

    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data ==='/again'){
            return startGame(chatId)
        }
        if(data == chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю! ${chats[chatId]}`, againOptions)
        }
        else{
            return bot.sendMessage(chatId, `False, ${chats[chatId]}`, againOptions);
        }

        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        console.log(msg);
    })
    
}

start()