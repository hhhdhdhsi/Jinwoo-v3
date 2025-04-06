import axios from "axios";
import config from "../config.cjs";

const apkDownloader = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const query = m.body.slice(prefix.length + cmd.length).trim();

  if (!["apk", "app", "application"].includes(cmd)) return;
  if (!query) return Matrix.sendMessage(m.from, { text: "❌ *Usage:* `.apk <App Name>`" }, { quoted: m });

  try {
    await Matrix.sendMessage(m.from, { react: { text: "⬆️", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(query)}/limit=1`;
    const { data } = await axios.get(apiUrl);

    if (!data?.datalist?.list?.length) {
      return Matrix.sendMessage(m.from, { text: "⚠️ *No results found for the given app name.*" }, { quoted: m });
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `const caption = `
📲 *KING GANESHA-MD APK INSTALLER* 📲

▰▰▰▰▰▰▰▰▰▰▰▰
🖥️ *Application:* ${app.name}
📦 *Package:* ${app.package}
📊 *Size:* ${appSize} MB
🔄 *Version:* ${app.updated}
👨‍💻 *Developer:* ${app.developer.name}
▰▰▰▰▰▰▰▰▰▰▰▰

✅ *Verified Features:*
• 100% Malware-Free
• Optimized Performance
• Latest Security Patches
• Auto-Update Support

⚠️ *Disclaimer:*
This APK is provided as-is. The developer is not responsible for any device compatibility issues or damages.

▰▰▰▰▰▰▰▰▰▰▰▰
⚡ *Brought to you by KING GANESHA-MD*
🔗 *Official Channel:* [channel-link]
`;

    await Matrix.sendMessage(m.from, { react: { text: "⬆️", key: m.key } });

    await Matrix.sendMessage(m.from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363306168354073@newsletter",
          newsletterName: "ᴍᴀʟᴠɪɴ ᴛᴇᴄʜ🪀",
          serverMessageId: 143,
        },
      },
    }, { quoted: m });

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("APK Downloader Error:", error);
    Matrix.sendMessage(m.from, { text: "❌ *An error occurred while fetching the APK. Please try again.*" }, { quoted: m });
  }
};

export default apkDownloader;