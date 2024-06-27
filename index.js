const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    puppeteer: {headless: false},
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

// Fetch your API_KEY
const API_KEY = "AIzaSyDzabYNgBaUrPnwhfJCzFod6NB4aYXG1pw";

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
    safetySettings: {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH
    }
});

const chat = model.startChat({
    history: [],
    generationConfig: {
        maxOutputTokens: 100
    }
});

client.on('message', async (message) => {

    try {

        if (message.body != '') {

            client.sendMessage(message.from, "Generating...");

            const prompt = message.body;

            const result = await chat.sendMessageStream(prompt);
            const response = await result.response;
            const text = response.text();

            client.sendMessage(message.from, text);

        }

    } catch (e) {
        console.log(e);

        client.sendMessage(message.from, "Maaf gagal menghasilkan jawaban, silahkan coba lagi");
    }
});



