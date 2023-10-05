import User from '../../Models/users.js';

async function registeruser(username) {
    // try {
    const user = await User.create({ username });
    return user;
    // } catch (err) {

    //     console.log("error start " + err);
    //     return err;
    // }
}

async function setpersona(username,persona){
    const upsert = await User.findOneAndUpdate({username: username}, {persona: persona}, {new: true, upsert: true});
    return upsert;
}

async function pushconvo(username, message) {
    const pushmessage = await User.findOneAndUpdate({username: username}, {$push: {conversation: message}}, {new: true, upsert: true});
    return pushmessage;
}

async function grabconvo(username){
    const userdata = await User.findOne({username: username});
    return userdata;
}

async function ifexsists (username){
    console.log("checking if user exists")
    const exists = await User.exists({username: username});
    return exists;
}

async function clear(username){
    const convoclear = User.findOneAndUpdate({username: username}, {conversation: []}, {new: true, upsert: true});
    return convoclear;
}

async function unreg(username){
    const deluser = User.findOneAndDelete({username: username});
    return deluser;
}

// if (message.content.substring(0, 4) === "!hat"){
//     //console.log("hat message identified")
//     const prompt = message.content.substring(4);
//     // {role:"user", content: message.content.substring(3)};
//     var awnser = await _chat(prompt);

//     if (awnser.substring(0,6) == "Error:"){
//         client.channels.fetch(message.channelId).then(channel => channel.send("An Error has occured! I cannot awnser"))
//     }
//     else{
//         while (awnser.length > 0) {
//             let chunk = awnser.substring(0, 2000);
//             if (awnser.length > 2000) {
//                 while (chunk.charAt(chunk.length - 1) !== " " && chunk.length > 1){
//                     chunk = chunk.substring(0, chunk.length - 1);
//                 }

//                 client.channels.fetch(message.channelId).then(channel => channel.send(chunk));
//                 awnser = awnser.substring(chunk.length);
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//             }
//             else {
//                 client.channels.fetch(message.channelId).then(channel => channel.send(awnser));
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//                 awnser = "";
//             }
//         }
//     }
// }

export { registeruser, setpersona, pushconvo, grabconvo, ifexsists, clear, unreg };