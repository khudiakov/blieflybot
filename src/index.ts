import * as dotenv from "dotenv";
dotenv.config();

import Telegraf from "telegraf";
import fetch from "node-fetch";
import { URL } from "url";

const fetchSummary = async (url: any) => {
  const body = {
    SM_API_KEY: process.env.API_TOKEN,
    SM_URL: url.toString()
  };

  const query =
    "https://api.smmry.com?" +
    Object.entries(body)
      .map(entry => entry.join("="))
      .join("&");

  const response = await fetch(query);
  const data = await response.json();

  return data.sm_api_error != null ? data.sm_api_message : data.sm_api_content;
};

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply("Welcome!"));

bot.command("link", async ctx => {
  let [_, link] = ctx.message.text.split(" ");
  link = link.trim();

  try {
    const url = new URL(link);
    const summary = await fetchSummary(url);
    ctx.reply(summary);
    return;
  } catch (error) {
    console.error(error);
    ctx.reply("No!");
    return;
  }
});

bot.launch();
