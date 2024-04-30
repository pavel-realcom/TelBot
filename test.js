const { fetchChatGPTResponse } = require('./openai');

async function test() {
    const response = await fetchChatGPTResponse("Hi how are you?");
    console.log(response);
}

test();