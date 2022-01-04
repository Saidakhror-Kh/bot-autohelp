const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const sequelize = require('./db');
const UserModel = require('./models');


const token = '5026585404:AAGnE9wniFFs5XKo4vq-oLm9D8HayhtohNk'

const bot = new TelegramApi(token,{polling: true})

const chats = {}



const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!")
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `answer ${chats[chatId]}`)
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = async() =>{
    try{
        await sequelize.authenticate()
        await sequelize.sync()
    } catch(e){
        console.log("Подключение к бд сломалось", e);
    }


    bot.setMyCommands([
        {command: '/start', description:'Начало работы бота'},
        {command: '/info', description:'получить информацию о боте'},
        {command: '/game', description:'бот игра'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        try {
            if (text === '/start'){
                await UserModel.create({chatId});
                await bot.sendSticker(chatId, 'CAACAgIAAxkBAANbYcwvbLYqumWbEYT2B1Gh1U_kIM0AAkwAA8OaZCnuwnhKg_sC2SME' );
                return bot.sendMessage(chatId, `Добро пожаловать!`);
             }
             if (text=== '/info'){
                 const user = await UserModel.findOne({chatId})
                 if (msg.from.last_name === undefined){
                    return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}. В игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}` )
                 }
                 else{
                    return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}. В игре у тебя правильных ответов ${user.right}, неправильных ${user.wrong}`)
                 }
             }
             if (text === '/game'){
                 return startGame(chatId);
             }
             return bot.sendMessage(chatId, 'Я тебя не понимаю, у меня нет такой команды');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла ошибка'), e;
        }
        
    })


    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data ==='/again'){
            return startGame(chatId)
        }
        const user = await UserModel.findOne({chatId})
        if(data == chats[chatId]){
            user.right +=1;
            await bot.sendMessage(chatId, `Поздравляю! ${chats[chatId]}`, againOptions)
        }
        else{
            user.wrong +=1;
            await bot.sendMessage(chatId, `False, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
        await user.save();
    })
    
}

start()