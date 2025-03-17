import {
  Bot,
  Keyboard,
  GrammyError,
  HttpError,
  InlineKeyboard,
  session,
} from "grammy";
import "dotenv/config";
import axios from "axios";
import { getRandomGame } from "./getRandomGame.js";

const bot = new Bot(process.env.BOT_API_KEY);

function initial() {
  return {
    adultContent: false,
  };
}

bot.use(session({ initial }));

bot.command("start", async (context) => {
  const start = new Keyboard()
    .text("Возможности")
    .text("О приложении")
    .text("Случайная игра")
    .text("Отключить цензуру 😏")
    .resized();

  await context.reply("Я готов к работе!");
  await context.reply("Что вы хотите узнать?", { reply_markup: start });
});

bot.hears("Случайная игра", async (context) => {
  const adult = context.session.adultContent;
  const id = await getRandomGame(adult);

  await context.reply(`https://store.steampowered.com/app/${id}/`);
});

bot.hears("Отключить цензуру 😏", async (context) => {
  if (context.session.adultContent === true) {
    context.session.adultContent = false;
  } else {
    context.session.adultContent = true;
  }
  console.log(context.session);
  context.session.adultContent === true
    ? await context.reply("Цензура отключена")
    : await context.reply("Цензура включена");
});

bot.hears("бот", async (context) => {
  await context.reply("Здесь нет никаких ботов 🤫");
});

bot.hears("О приложении", async (context) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("О NodeJs", "getNode")
    .text("О grammY", "getGrammY");
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
  if (ctx.callbackQuery.data === "getGrammY") {
    await ctx.reply(
      "grammY - JavaScript библиотека, позволяющая писать телеграм ботов и запускать их на различных платформах."
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
