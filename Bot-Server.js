import 'dotenv/config'
//discord
const token = process.env.DISCORD_TOKEN;
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Data } from "./Database/Data.js";
import { Write } from './Utils/Writedata.js';
import { image, chatold, chat as _chat } from "./Utils/AI.js";
import fetch from 'node-fetch';
import { registeruser, setpersona, pushconvo, grabconvo, ifexsists, clear, unreg} from './Utils/datacontrol/datacontrol.js';
import db from "./config/connection.js"
import helpmessage from './Utils/help.js';
//twitch
import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { Bot, createBotCommand } from '@twurple/easy-bot';
import { promises as fs } from 'fs';
import { env } from "process";
import { Wizlistener} from "./Utils/WizListner.js"
import { Suelistener} from "./Utils/SueListner.js"
import { get } from 'http';
const WizusrId = '74719300'
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
db.once('open', () => {console.log('connected to database')})
client.on(Events.ClientReady, function (c) {
    console.log(`${c.user.tag} is online`);
});
async function gamecheck () {
    try {
        const response = await fetch("localhost:3001/api/GamesTable/1")
        const json = await response.json();
        console.log(json);
    } catch (error) {
        console.log(error);
    }
}
client.on(Events.MessageCreate, async message =>{
    if (message.content === "!patdat"){
        //console.log("Data message identified")
        client.channels.fetch(message.channelId).then(channel => channel.send(`Suepats: ${Data.Suepats}\nWizpats: ${Data.Wizpats}\nKarapats: ${Data.Karapats}\nIcepats: ${Data.Icepats}\nMikapats: ${Data.Mikapats}\nZingypats: ${Data.Zingypats}\nSueboops: ${Data.Sueboops}\nWizboops: ${Data.Wizardboops}`));
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
// datacontrol
    if (message.content.substring(0, 4) === "!reg"){
        console.log("register message identified")
        try {
        //client.channels.fetch(message.channelId).then(channel => channel.send("registerd!"))
        await registeruser(message.author.username)
        } catch (error) {
            //console.log(error)
            client.channels.fetch(message.channelId).then(channel => channel.send("error! it appears you are already registered!"))
        }
    }

    if (message.content.startsWith('!persona')) {
        console.log("persona message identified")
        var exists = await ifexsists(message.author.username)
        if (exists == null){client.channels.fetch(message.channelId).then(channel => channel.send("You are not registered please use !reg"))}
        else {
        try {
        //client.channels.fetch(message.channelId).then(channel => channel.send("registerd!"))
        await setpersona(message.author.username, message.content.substring(8))
        } catch (error) {
            console.log(error)
        }
        }
    }

    if (message.content.startsWith('!clear')) {
        console.log("clear message identified")
        var exists = await ifexsists(message.author.username)
        if (exists == null){client.channels.fetch(message.channelId).then(channel => channel.send("You are not registered please use !reg"))}
        else {
        try {
        await clear(message.author.username)
        } catch (error) {
            console.log(error)
        }
        }
    }

    if (message.content.startsWith('!unreg')) {
        console.log("unreg message identified")
        var exists = await ifexsists(message.author.username)
        if (exists == null){client.channels.fetch(message.channelId).then(channel => channel.send("You are not registered please use !reg"))}
        else {
        try {
        await unreg(message.author.username)
        } catch (error) {
            console.log(error)
        }
        }
    }

//end data control
    if (message.content.substring(0, 3) === "!ai"){
 console.log("ai message identified")
    const prompt = message.content.substring(4);
    // {role:"user", content: message.content.substring(3)};
    var awnser = await chatold(prompt);

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

                client.channels.fetch(message.channelId).then(channel => channel.send(chunk));
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
    if (message.content.startsWith('!hat')){
        console.log("hat message identified")
        const prompt = message.content.substring(5);
        const username = message.author.username
        const exsists = await ifexsists(username)
        // console.log(exsists)
        if (exsists == null){
            //console.log("user not found chat old started")
            var awnser = await chatold(prompt);

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

                client.channels.fetch(message.channelId).then(channel => channel.send(chunk));
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
        else { 
            //console.log("user found chat started")
        grabconvo(username).then(async function (userdata){
            var conversation = [
                {role: 'assistant', content: userdata.persona},
            ]
            for (let i = 0; i < userdata.conversation.length; i++) {
                conversation.push({role: "user", content: userdata.conversation[i]})
            }
            conversation.push({role: "user", content: prompt})
            console.log(conversation)

            var awnser = await _chat(conversation);

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
        
                        client.channels.fetch(message.channelId).then(channel => channel.send(chunk));
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
        })
        pushconvo(username, prompt)
        }
    }

    if (message.content.substring(0, 5) === "!game"){
        try {
            // fetch to Gamerli https://github.com/GameW1zard/GamerLi
            const response = await fetch("http://127.0.0.1:3001/api/GamesTable/1")
            const gamelist = await response.json();
            var game = gamelist[Math.floor(Math.random() * gamelist.length)];
            client.channels.fetch(message.channelId).then(channel => channel.send(`A random game that the W1zard should play is ${game.game_name}`));
        } catch (error) {
            console.log(error);
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
    if (message.content === "<:wboop:886452053239562262>"){
        Data.Wizardboops = ++Data.Wizardboops
        Write(Data)
            client.channels.fetch(message.channelId).then(channel => channel.send(`W1zard has been booped ${Data.Wizardboops} times!`))
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
        client.channels.fetch(message.channelId).then(channel => channel.send(helpmessage));
    }
    
    if (message.content === "is sue cute?"){
        console.log("Cute message identified")
        client.channels.fetch(message.channelId).then(channel => channel.send("Sue is the Cutest!"));
    }
});

client.on(Events.MessageCreate, async message =>{

console.log(`%cDISCORD ${message.author.username}: ${message.content}`, 'color: #ADD8E6')

})
//end discord bot

//start Twitch bot
function wizgolive () {
Wizlistener.start()
let onlineSubscription = Wizlistener.onStreamOnline(WizusrId, e =>{
    let StreamChannel = "827624206694481961"
    console.log(`${e.broadcasterDisplayName} just went live`)
    client.channels.fetch(StreamChannel).then(function (channel){
        channel.send(`@everyone The W1zard has gone live! Come join his magical adventures at
        https://twitch.tv/Game_W1zard`)
    });
})
}
wizgolive()

function suegolive () {
Suelistener.start()
let SueusrId = "24641514"
let onlineSubscription = Suelistener.onStreamOnline(SueusrId, e =>{
    let StreamChannel = "827624206694481961"
    console.log(`${e.broadcasterDisplayName} just went live`)
    client.channels.fetch(StreamChannel).then(function (channel){
        channel.send(` The adorable Sue has gone live! Come join her adventures at
        https://twitch.tv/time_spirit_suegoy`)
    });
})
}
// suegolive()


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
