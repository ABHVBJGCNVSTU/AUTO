const request = require('request');
const moment = require('moment-timezone');

module.exports.config = {
  name: "bot",
  version: "1.0.0",
  role: 0,
  hasPrefix: false,
  description: "Get thread ID and group image",
  usages: "tid",
  credits: "Developer",
  cooldowns: 0
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  const { threadID, senderID } = event;
  const time = moment.tz("Asia/Manila").format("HH:MM:ss L");
  const name = await Users.getNameUser(senderID);

  const quotes = [
    "میــــــرے نال ویا کــــــر لو 😊💔",
    "Ittuu🤏 si shram ker Lya kro bot bot krty wqt 🙂 💔✨⚠️",
    "itna single hun ky khuwab mai bhi  lrki k han krny sy phly ankh khul jati🙂",
    // Add all other quotes here...
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  api.sendMessage(randomQuote, threadID);
};
