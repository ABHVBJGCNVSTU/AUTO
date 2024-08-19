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
        // Get participants and sender data
        var { participantIDs } = (await Threads.getData(event.threadID)).threadInfo;
        var senderName = (await Users.getData(event.senderID)).name;
        
        // Filter out bot ID and sender ID
        const botID = api.getCurrentUserID();
        const listUserID = participantIDs.filter(ID => ID != botID && ID != event.senderID);
        
        if (listUserID.length === 0) {
            return api.sendMessage("No other participants found in this thread.", event.threadID, event.messageID);
        }
        
        // Randomly select a user
        var selectedID = listUserID[Math.floor(Math.random() * listUserID.length)];
        var selectedName = (await Users.getData(selectedID)).name;
        
        // Generate random compatibility score
        var compatibilityScore = Math.floor(Math.random() * 101);
        
        // Download profile pictures
        let senderAvatar = await downloadImage(`https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=YOUR_ACCESS_TOKEN`);
        let selectedAvatar = await downloadImage(`https://graph.facebook.com/${selectedID}/picture?width=512&height=512&access_token=YOUR_ACCESS_TOKEN`);
        
        // Download a random gif
        const gifCute = [
            "https://i.pinimg.com/originals/42/9a/89/429a890a39e70d522d52c7e52bce8535.gif",
            "https://i.imgur.com/HvPID5q.gif",
            "https://i.pinimg.com/originals/9c/94/78/9c9478bb26b2160733ce0c10a0e10d10.gif",
            "https://i.pinimg.com/originals/9d/0d/38/9d0d38c79b9fcf05f3ed71697039d27a.gif",
            "https://i.imgur.com/BWji8Em.gif",
            "https://i.imgur.com/ubJ31Mz.gif"
        ];
        let loveGif = await downloadImage(gifCute[Math.floor(Math.random() * gifCute.length)]);
        
        // Construct the message
        var arraytag = [
            { id: event.senderID, tag: senderName },
            { id: selectedID, tag: selectedName }
        ];
        
        var imglove = [
            fs.createReadStream(senderAvatar),
            fs.createReadStream(loveGif),
            fs.createReadStream(selectedAvatar)
        ];
        
        var msg = {
            body: `🅢𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋 🅟𝐀𝐈𝐑𝐈𝐍𝐆\n𝐇𝐎𝐏𝐄 𝐘𝐎𝐔 𝐁𝐎𝐓𝐇 𝐖𝐈𝐋𝐋 𝐒𝐓𝐎𝐏 𝐅𝐋𝐈𝐑𝐓𝐈𝐍𝐆 ⊂◉‿◉\n━━━━━━━━━━━━━━━━━━\n${senderName} 💓 ${selectedName}\n━━━━━━━━━━━━━━━━━━\n➥ 𝐃𝐎𝐔𝐁𝐋𝐄 𝐑𝐀𝐓𝐈𝐎: ${compatibilityScore}%\n━━━━━━━━━━━━━━━━━━\n𝙊𝙬𝙣𝙚𝙧 𝙈𝙞𝙖𝙣 𝘼𝙢𝙞𝙧`,
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
        fs.unlinkSync(path.join(__dirname, "cache", "avt.png"));
        fs.unlinkSync(path.join(__dirname, "cache", "giflove.png"));
        fs.unlinkSync(path.join(__dirname, "cache", "avt2.png"));
    }
};

// Helper function to download images
async function downloadImage(url) {
    try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const imagePath = path.join(__dirname, "cache", path.basename(url));
        fs.writeFileSync(imagePath, Buffer.from(response.data, "utf-8"));
        return imagePath;
    } catch (error) {
        console.error(`Error downloading image from ${url}:`, error);
        throw new Error("Failed to download image.");
    }
}
