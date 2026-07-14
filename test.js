require('dotenv').config();

const genai=require('@google/genai');

const ai=new genai.GoogleGenAI({
    apikey:process.env.GEMINI_API_KEY
});

async function main(){
    const response=await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents:"say hello"
    });
    console.log(response.text);
}
main();
