const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "pair",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Friends pairing",
  usages: "love pair",
  credits: "Developer",
  cooldowns: 0
};

module.exports.run = async function({ api, event, Threads, Users }) {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];

    try {
        // Get thread and participant data
        var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
        var tle = Math.floor(Math.random() * 101);
        var senderName = (await Users.getData(event.senderID)).name;

        const botID = api.getCurrentUserID();
        const listUserID = participantIDs.filter(ID => ID != botID && ID != event.senderID);
        if (listUserID.length === 0) {
            return api.sendMessage("No other participants found in this thread.", event.threadID, event.messageID);
        }

        var selectedID = listUserID[Math.floor(Math.random() * listUserID.length)];
        var selectedName = (await Users.getData(selectedID)).name;
        var arraytag = [
            { id: event.senderID, tag: senderName },
            { id: selectedID, tag: selectedName }
        ];

        // List of GIFs to randomly select from
        const gifCute = [
            "https://i.pinimg.com/originals/42/9a/89/429a890a39e70d522d52c7e52bce8535.gif",
            "https://i.imgur.com/HvPID5q.gif",
            "https://i.pinimg.com/originals/9c/94/78/9c9478bb26b2160733ce0c10a0e10d10.gif",
            "https://i.pinimg.com/originals/9d/0d/38/9d0d38c79b9fcf05f3ed71697039d27a.gif",
            "https://i.imgur.com/BWji8Em.gif",
            "https://i.imgur.com/ubJ31Mz.gif"
        ];

        // Download the images and GIF
        let senderAvatarPath = await downloadImage(`https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=YOUR_ACCESS_TOKEN`, 'avt.png');
        let loveGifPath = await downloadImage(gifCute[Math.floor(Math.random() * gifCute.length)], 'giflove.png');
        let selectedAvatarPath = await downloadImage(`https://graph.facebook.com/${selectedID}/picture?width=512&height=512&access_token=YOUR_ACCESS_TOKEN`, 'avt2.png');

        // Prepare attachments
        var imglove = [
            fs.createReadStream(senderAvatarPath),
            fs.createReadStream(loveGifPath),
            fs.createReadStream(selectedAvatarPath)
        ];

        // Construct the message
        var msg = {
            body: `🅢𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋 🅟𝐀𝐈𝐑𝐈𝐍𝐆\n𝐇𝐎𝐏𝐄 𝐘𝐎𝐔 𝐁𝐎𝐓𝐇 𝐖𝐈𝐋𝐋 𝐒𝐓𝐎𝐏 𝐅𝐋𝐈𝐑𝐓𝐈𝐍𝐆 ⊂◉‿◉\n━━━━━━━━━━━━━━━━━━ ${senderName} 💓 ${selectedName}\n━━━━━━━━━━━━━━━━━━\n➥ 𝐃𝐎𝐔𝐁𝐋𝐄 𝐑𝐀𝐓𝐈𝐎: ${tle}%\n━━━━━━━━━━━━━━━━━━\n𝙊𝙬𝙣𝙚𝙧 𝙈𝙞𝙖𝙣 𝘼𝙢𝙞𝙧`,
            mentions: arraytag,
            attachment: imglove
        };

        // Send the message
        return api.sendMessage(msg, event.threadID, event.messageID);

    } catch (error) {
        console.error(error);
        return api.sendMessage("An error occurred while trying to pair users. Please try again later.", event.threadID, event.messageID);
    } finally {
        // Clean up temporary files
        cleanupTempFiles(['avt.png', 'giflove.png', 'avt2.png']);
    }
};

// Helper function to download images
async function downloadImage(url, filename) {
    const axios = global.nodemodule["axios"];
    const filePath = path.join(__dirname, "cache", filename);
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));
        return filePath;
    } catch (error) {
        console.error(`Error downloading image from ${url}:`, error);
        throw new Error("Failed to download image.");
    }
}

// Helper function to clean up temporary files
function cleanupTempFiles(filenames) {
    filenames.forEach(filename => {
        const filePath = path.join(__dirname, "cache", filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
}
