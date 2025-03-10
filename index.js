import { Bot, Keyboard, GrammyError, HttpError, InlineKeyboard } from "grammy";
import "dotenv/config";

const bot = new Bot(process.env.BOT_API_KEY);

bot.command("start", async (context) => {
  const start = new Keyboard()
    .text("Возможности")
    .text("О приложении")
    .resized();

  await context.reply("Я готов к работе!");
  await context.reply("Что вы хотите узнать?", { reply_markup: start });
});

bot.hears("бот", async (context) => {
  await context.reply("Здесь нет никаких ботов 🤫");
});

bot.hears("О приложении", async (context) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("О NodeJs", "getNode")
    .text("О grammY", "getgrammY");
  await context.reply(
    "Данное приложение создано на NodeJs с использованием библиотеки grammY.",
    { reply_markup: inlineKeyboard }
  );
});

bot.on("callback_query:data", async (ctx) => {
  if (ctx.callbackQuery.data === "getNode") {
    await ctx.reply(
      "Node.js — это среда выполнения кода JavaScript вне браузера, которая позволяет писать серверный код для веб-страниц и веб-приложений, а также для программ командной строки."
    );
    await ctx.answerCallbackQuery();
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
