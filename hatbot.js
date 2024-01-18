//dotenv inports
import 'dotenv/config';
//file imports
import {chat,image} from "./ai.js"
import {registeruser, setpersona, pushconvo, grabconvo, ifexsists, clear, unreg} from "./utils/datacontrol/datacontrol.js"
import {Print} from "./utils/Print.js"
// discord inports
import {Client,Events,GatewayIntentBits,ChannelType} from 'discord.js';
// twitch imports

//BEGIN DB
import db from "./config/connection.js"
import { set } from 'mongoose';
db.once('open', () => {console.log('connected to database')})
//BEGIN DISCORD

const sendChunks = async (channel, awnser) => {
    console.log(`chunk triggered`)
    while (awnser.length > 0) {
        let chunk = awnser.slice(0, 2000);
        if (awnser.length > 2000) {
            while (chunk.charAt(chunk.length - 1) !== " " && chunk.length > 1) {
                chunk = chunk.slice(0, -1);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        await channel.send(chunk);
        awnser = awnser.slice(chunk.length);
    }
}

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.once (Events.ClientReady, function (logon) {
    console.log(`Logged in as ${logon.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

client.on(Events.MessageCreate, async function (message) {
    let channel = message.channel
    let username = message.author.username
    let promtall = [{role: "system", content: "you are a posh butler named hatbot!"}, {role: "user", content: message.content.slice (5)}]
    //console.log(message.author)
    //let prompt = [{role: "user", content: message.content.slice (5)}]
    let exists = await ifexsists(username)
    //console.log (message.content)
    switch (true) {
        case message.content.startsWith("!help"):
            await channel.sendTyping();
            console.log (`help requested`)
            const sends = await channel.send(`commands are !hat, !reg, !unreg, !clear, !persona, !thread, !image and !print`)
            clearInterval(intervalId);
            break;
        case message.content.startsWith("!thread"):
            const thread = await channel.threads.create({
                name: `${username}'s Bot thread`,
                autoArchiveDuration: 60,
                type: ChannelType.PrivateThread,
                reason: 'Private bot chat',
            });
            message.react('<:hat:829123443747717120>');
            //console.log(`Created thread: ${thread.name}`);
            let addusertothread = channel.threads.cache.find(x => x.name === `${username}'s Bot thread`);
            await addusertothread.members.add(message.author.id);
            
            break;
        case message.content.startsWith("!clear"):
            await channel.sendTyping()
            console.log (`clear requested`)
            if (exists == null){
                console.log(`user not found`)
                const send = await channel.send(`user ${username} not registered`)
            }
            else {
                //console.log(`user found`)
                message.react('<:hat:829123443747717120>');
                const clearconv = await clear(username)
                //const send = await channel.send(`user ${username} conversation cleared`)
            }
            break;
        case message.content.startsWith("!persona"):
            await channel.sendTyping()
            console.log (`persona requested`)
            if (exists == null){
                console.log(`user not found`)
                const send = await channel.send(`user ${username} not registered`)
            }
            else {
                //console.log(`user found`)
                const set = await setpersona(username,message.content.slice(8))
                message.react('<:hat:829123443747717120>');
                //const send = await channel.send(`user ${username} persona set to ${message.content.slice(8)}`)
            }
            break;

        case message.content.startsWith("!reg"):
            await channel.sendTyping()
            console.log (`registration requested`)
            
            if (exists == null){
                console.log(`user not found`)
                const register = await registeruser(username)
                message.react('<:hat:829123443747717120>');
                //const send = await channel.send(`user ${username} registered`)
            }
            else {
                console.log(`user found`)
                const send = await channel.send(`user ${username} already registered`)
            }
            break;
        case message.content.startsWith("!unreg"):
            await channel.sendTyping()
            console.log (`unregistration requested`)
            if (exists == null){
                console.log(`user not found`)
                const send = await channel.send(`user ${username} not registered`)
            }
            else {
                console.log(`user found`)
                const unreguser = await unreg(username)
                message.react('<:hat:829123443747717120>');
                //const send = await channel.send(`user ${username} unregistered`)
            }
            break;
            case message.content.startsWith("!image"):

                await channel.sendTyping()
                const intervalId = setInterval(async () => {
                await channel.sendTyping();
                console.log (`typing`)
                }, 9000);

                console.log (`image requested`)
                let awnser = await image (message.content.slice(7))
                const send = await channel.send(awnser);

                clearInterval(intervalId);
                
                break;
        case message.content.startsWith("!hat"):
                
            console.log(message.content,message.channel.type);
            console.log(`hat requested`);
            try {
            if (exists == null){
                console.log(`user not found`)
                let awnser = await chat (promtall)
                // const send = await channel.send(awnser);
                sendChunks(channel, awnser);
            }
            else {
                await channel.sendTyping()
                const intervalId = setInterval(async () => {
                await channel.sendTyping();
                console.log (`typing`)
                }, 9000);
                let awnser
                let conversation = []
                console.log(`user found`)
                grabconvo(username).then(async function (userdata){
                    let conversation = [
                        {role: "system", content: userdata.persona},                
                    ]
                    //console.log(userdata)
                    
                    for (let i = 0; i < userdata.conversation.length; i++) {
                        conversation.push(userdata.conversation[i])
                    }
                    conversation.push({role: "user", content: message.content.slice (5)})
                    
                    let awnser = await chat (conversation)
                    conversation.push({role: "assistant", content: awnser}) 
                    //const send = await channel.send(awnser);
                    sendChunks(channel, awnser);
                    conversation.shift()
                    //console.log (conversation)
                    await pushconvo(username,conversation)
                    console.log (`typing done`)
                    clearInterval(intervalId);
                })
                
                // pushconvo({role: "user", content: message.content.slice (5)})
                // pushconvo({role: "assistant", content: awnser})
                
            }} catch (error){
                console.log (error)
            }

            break;

        case message.content.startsWith("!print"):
            await channel.sendTyping()
            console.log (`print requested`)
            if (exists == null){
                console.log(`user not found`)
                const send = await channel.send(`user ${username} not registered`)
            }
            else {
                try {
                console.log(`user found`)
                //console.log(`before print`)
                await Print(username)

                } catch (error){    
                    console.log (error)
                }
                setTimeout(function () {
                    channel.send({ files: [`./prints/${username}.txt`] })
                }, 1000)
                const send2 = await message.react('<:hat:829123443747717120>');
            }
            break;
        
        case message.content.startsWith("!read"):
            await channel.sendTyping()
            console.log (`read requested`)
            if (ifexsists(message.content.slice(6)) === ""){
                console.log(`user not found`)
                const send = await channel.send(`user ${message.content.slice(6)} not registered`)
            }
            else {
                try {
                console.log(`user found`)
                //console.log(`before print`)
                await Print(message.content.slice(6))

                } catch (error){    
                    console.log (error)
                }
                setTimeout(function () {
                    channel.send({ files: [`./prints/${message.content.slice(6)}.txt`] })
                }, 1000)
                const send2 = await message.react('<:hat:829123443747717120>');
            }
            break;
            
    }

    
});

//BEGIN TWITCH
