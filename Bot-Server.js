import 'dotenv/config'
//discord
const token = process.env.DISCORD_TOKEN;
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Data } from "./Database/Data.js";
import { Write } from './Utils/Writedata.js';
import { image, chat as _chat } from "./Utils/AI.js";
const StreamChannelId = '827624206694481961';
//twitch
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { Bot, createBotCommand } from '@twurple/easy-bot';
import { promises as fs } from 'fs';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { env } from "process";
const usrId = '69696969'
const clientId = env.TWITCH_CLIENT_ID;
const clientSecret = env.TWITCH_CLIENT_SECRET;
const tokenData = JSON.parse(await fs.readFile('./Utils/tokens.526128405.json', 'UTF-8'));
const authProvider = new RefreshingAuthProvider(
	{
		clientId,
		clientSecret,
		onRefresh: async (userId, newTokenData) => await fs.writeFile(`./tokens.${userId}.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8')
	}
);
const apiClient = new ApiClient({ authProvider });
// begin discord bot
const client  = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
client.on(Events.ClientReady, function (c) {
    console.log(`${c.user.tag} is online`);
});
client.on(Events.MessageCreate, async message =>{
    if (message.content === "!patdat"){
        console.log("Data message identified")
        // console.log(Data)
        client.channels.fetch(message.channelId).then(channel => channel.send(`Suepats: ${Data.Suepats}\nWizpats: ${Data.Wizpats}\nKarapats: ${Data.Karapats}\nIcepats: ${Data.Icepats}\nMikapats: ${Data.Mikapats}\nZingypats: ${Data.Zingypats}\nSueboops: ${Data.Sueboops}`));
    }

    if(message.content.substring(0,6) === "!image") {
        const prompt = message.content.substring(6);
        var awnser = await image(prompt);
        if (awnser.substring(0,6) == "Error:") {
            client.channels.fetch(message.channelId).then(channel => channel.send(awnser));
        }
        else {
            client.channels.fetch(message.channelId).then(channel => channel.send({files: [{ attachment: awnser, name: 'image.png' }]}))
        }
    }

    if (message.content.substring(0, 3) === "!ai"){
        //console.log("ai message identified")
        const prompt = [{role:"user", content: message.content.substring(3)}];
        var awnser = await _chat(prompt);

        if (awnser.substring(0,6) == "Error:"){
            client.channels.fetch(message.channelId).then(channel => channel.send("An Error has occured! I cannot awnser"))
        }
        else{
            while (awnser.length > 0) {
                let chunk = awnser.substring(0, 2000);
                if (awnser.length > 2000) {
                    while (chunk.charAt(chunk.length - 1) !== " " && chunk.length > 1){
                        chunk = chunk.substring(0, chunk.length - 1);
                    }

                    client.channels.fetch(message.channelId).then(chennel => channel.send(chunk));
                    awnser = awnser.substring(chunk.length);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                else {
                    client.channels.fetch(message.channelId).then(channel => channel.send(awnser));
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    awnser = "";
                }
            }
        }
    }

    if (message.content === "<:boop:866867768536334366>"){
        Data.Sueboops = ++Data.Sueboops
        Write(Data)
        
          client.channels.fetch(message.channelId).then(channel => channel.send(`Sue has been booped ${Data.Sueboops} times!`))
    }
 
    if (message.content === "<:suegoy_Pat:911852322433421382>"){
        Data.Suepats = ++Data.Suepats
        Write(Data)
         client.channels.fetch(message.channelId).then(channel => channel.send(`Sue has been pet ${Data.Suepats} times!`))
    }

    if (message.content === "<:WizardPat:943349812261158912>"){
        Data.Wizpats = ++Data.Wizpats
        Write(Data)
         client.channels.fetch(message.channelId).then(channel => channel.send(`W1zard has been pet ${Data.Wizpats} times!`))
    }

    if (message.content === "<:karapat:918331877985755237>"){
        Data.Karapats = ++Data.Karapats
        Write(Data)
         client.channels.fetch(message.channelId).then(channel => channel.send(`Kara hs been pet ${Data.Karapats} times!`))
    }

    if (message.content === "<:icePat:868622699851808828>"){
        Data.Icepats = ++Data.Icepats
        Write(Data)
         client.channels.fetch(message.channelId).then(channel => channel.send(`Ice has been pet ${Data.Icepats} times!`))
    }

    if (message.content === "<:mikaPat:928428058229231646>"){
        Data.Mikapats = ++Data.Mikapats
        Write(Data)
         client.channels.fetch(message.channelId).then(channel => channel.send(`mika has been pet ${Data.Mikapats} times!`))
    }

    if (message.content === "<:zingypat:907383379039756358>"){
        Data.Zingypats = ++Data.Zingypats
        // fs.writeFile(`./Database/Data.js`, `
        // var Data = {
        //     Suepats: ${.Data.Suepats},
        //     Wizpats: ${Patdat.Data.Wizpats},
        //     Karapats: ${Patdat.Data.Karapats},
        //     Icepats: ${Patdat.Data.Icepats},
        //     Sueboops: ${Patdat.Data.Sueboops},
        //     Mikapats: ${Patdat.Data.Mikapats},
        //     Zingypats: ${Patdat.Data.Zingypats},
        // }
        
        // exports.Data = Data`,
        // (err) => err ? console.error(err) : console.log("Write success! Check Output folder!"))
        Write(Data)
         client.channels.fetch(message.channelId).then(channel => channel.send(`Zingy has been pet ${Data.Zingypats} times!`))
    }

    if (message.content === "!help"){
        console.log("Help message identified")
        client.channels.fetch(message.channelId).then(channel => channel.send(`Hello! I am Hatbot I am a work in progress project by GameW1zard!\nI can do a few things check it out\n"!patdat": Will show you all the data i track in the server im in!\n"is sue cute": i can awnser the most inportant question of all!\n"!ai": start your prompt with !ai and ask the bot ~~almost~~ any question you want!\n"!image": Give me a prompt and i will do my best to draw it (i only have 3 crayons)\nPokeAPI integration is planned in the future. Have fun!`));
    }
    
    if (message.content === "is sue cute?"){
        console.log("Cute message identified")
        client.channels.fetch(message.channelId).then(channel => channel.send("Sue is the Cutest!"));
    }
});

client.on(Events.MessageCreate, async message =>{
//const StreamChannel = await client.channels.fetch("827624206694481961")
console.log(`%cDISCORD ${message.author.username}: ${message.content}`, 'color: #ADD8E6')
//StreamChannel.send("hello")
})
//end discord bot

//start Twitch bot
const listener = new EventSubWsListener({ apiClient });
const onlineSubscription = listener.onStreamOnline(usrId, e =>{
    console.log(`${e.broadcasterDisplayName} just went live`)
})

listener.start()


await authProvider.addUserForToken(tokenData, ['chat']);
const bot = new Bot(null, {
	authProvider,
	channels: ['Game_W1zard'],
	commands: [
		createBotCommand('dice', (params, { reply }) => {
			const diceRoll = Math.floor(Math.random() * 6) + 1;
			reply(`You rolled a ${diceRoll}`);
		}),
		createBotCommand('slap', (params, { userName, say }) => {
			say(`${userName} slaps ${params.join(' ')} around a bit with a large trout`);
		})
	]
});

bot.onSub(({ broadcasterName, userName }) => {
	bot.say(broadcasterName, `Thanks to @${userName} for subscribing to the channel!`);
});
bot.onResub(({ broadcasterName, userName, months }) => {
	bot.say(broadcasterName, `Thanks to @${userName} for subscribing to the channel for a total of ${months} months!`);
});
bot.onSubGift(({ broadcasterName, gifterName, userName }) => {
	bot.say(broadcasterName, `Thanks to @${gifterName} for gifting a subscription to @${userName}!`);
});

bot.onMessage(async (message) => {
    console.log(`%cTWITCH ${message.userDisplayName}: ${message.text}`, 'color: #BF40BF')

    switch (message.text) {
        case "gamew1Boop":
            Data.Sueboops = ++Data.Sueboops
            Write(Data)
            bot.say(message.broadcasterName, `sue has been booped ${Data.Sueboops} times!`);
        break;
        case "timesp5Pat":
            Data.Suepats = ++Data.Suepats
            Write(Data)
            bot.say(message.broadcasterName, `Sue has been pat ${Data.Suepats} times!`)
        break;
    }

})







client.login(token)
