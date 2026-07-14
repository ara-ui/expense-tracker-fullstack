const {GoogleGenAI}=require('@google/genai');

const ai=new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});


async function getCategory(description){

  const prompt = `
Classify this expense.

Categories:
Food
Travel
Shopping
Entertainment
Bills
Health
Education
Salary
Investment
Other

Expense:
${description}

Return ONLY one category.
`;

const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt
});



return response.text.trim();
}

module.exports={
    getCategory
};