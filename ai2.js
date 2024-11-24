import OpenAi from 'openai';
const openai = new OpenAi({
    baseURL: "http://192.168.50.131:11434/v1",
    apiKey: "ollama",
});

async function chat (prompt){
    let awnser;
    try {
        const response = await openai.chat.completions.create({
            model: "llama2-uncensored",
            messages: prompt,
        });
        awnser = response.choices[0].message.content;
    } catch (error){
        awnser = "Error: " + error.message;
    }
    return awnser;
}
async function imagesend (prompt){
    
    let awnser;
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            quality: "hd",
            size: "1792x1024"
        })
        awnser = response.data[0].url;
    } catch (error){ 
        awnser = "Error: " + error.message;
    }
    return awnser;
}

export {chat};
export {imagesend};