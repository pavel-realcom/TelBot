require('dotenv').config();
const { StringSession } = require('telegram/sessions')

const session = new StringSession(process.env.TG_SESSION)
const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const botToken = process.env.TG_BOT_KEY;
const oaiKey = process.env.OAI_KEY;
module.exports = {
  session,
  apiHash,
  apiId,
  botToken,
  oaiKey
}
