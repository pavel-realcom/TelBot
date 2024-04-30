
const { TelegramClient } = require('telegram')
const { Telegraf } = require('telegraf')
require('dotenv').config();

const { NewMessage } = require('telegram/events')
const { session, apiId, apiHash, botToken } = require('./config')
const { fetchChatGPTResponse } = require('./openai')

const bot = new Telegraf(botToken)

bot.command('watch', (ctx) => {
  const channelId = ctx.message.text.split(' ')[1]
  ctx.reply(`Channel ID: ${channelId}`)
})

const client = new TelegramClient(session, apiId, apiHash, {})

function watchNewMessages(channelId) {
  client.addEventHandler((event) => {
    console.log('new message', event.message.message)
  }, new NewMessage({ fromUsers: [channelId] }))
}

async function getUnreadMessages(channelId, limit = 10) {
  const dialogs = await client.getDialogs({})
  const channel = dialogs.find((d) => d.entity.username === channelId)
  if (channel) {
    const messages = await client.getMessages(channel.entity, {
      // limit: channel.unreadCount,
      limit,
    })
    return messages.map((m) => m.message).join(' ')
  } else {
    console.log('Channel not found:', channelId)
  }
};

(async function run() {
  // const channel = 'whale_alert_io' // for_demo_api

  // watchNewMessages(channel)

  await client.connect()

  bot.command('sum', async (ctx) => {
    const [, channelId, ...task] = ctx.message.text.split(' ')
    if (!channelId) {
      return ctx.reply(`Channel not provided:`)
    }

    const messagesString = await getUnreadMessages(channelId, 100);
    const apiResponse = await fetchChatGPTResponse(messagesString,task.join(' '));
    await ctx.reply(apiResponse)
  })

  bot.launch()
})()