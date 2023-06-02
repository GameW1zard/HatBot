import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration) 
async function chat(prompt) {
    let awnser;
    console.log("prompt recived")
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: prompt,
        });
        awnser = response.data.choices[0].message.content;
    } catch (error){
        // console.log (error)
        awnser = "Error: " + error.response.data.error.message;
    }
    // console.log(awnser)
    return awnser;
    
}
// const prompt = [{role: "user", content: "what are you"}]

async function image (prompt) {
    let awnser;
    try {
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });
        awnser = response.data.data[0].url;
    } catch (error) {
        awnser = `Error: ${error.response.data.error.message}`
    }
    return awnser;
}

const _chat = chat;
export { _chat as chat };
const _image = image;
export { _image as image };