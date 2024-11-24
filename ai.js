import OpenAi from 'openai';
const openai = new OpenAi({apiKey: process.env.OPENAI_KEY});

async function chat (prompt){
    let awnser;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
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