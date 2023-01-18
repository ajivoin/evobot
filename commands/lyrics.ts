import { CommandInteraction, MessageEmbed } from "discord.js";
import { i18n } from "../utils/i18n";
// @ts-ignore
import lyricsFinder from "lyrics-finder";
import { bot } from "../index";

export default {
  name: "lyrics",
  aliases: ["ly"],
  description: i18n.__("lyrics.description"),
  async execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue || !queue.songs.length) return interaction.reply(i18n.__("lyrics.errorNotQueue")).catch(console.error);

    let lyrics = null;
    const title = queue.songs[0].title;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    } catch (error) {
      lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(i18n.__mf("lyrics.embedTitle", { title: title }))
      .setDescription(lyrics)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (lyricsEmbed.description!.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description!.substr(0, 2045)}...`;

    return interaction.reply({ embeds: [lyricsEmbed] }).catch(console.error);
  }
};
