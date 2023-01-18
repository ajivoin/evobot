import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { CommandInteraction, GuildMember } from "discord.js";
import { bot } from "../index";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("shuffle")
          .setDescription(i18n.__("shuffle.description")),
  name: "shuffle",
  description: i18n.__("shuffle.description"),
  execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("shuffle.errorNotQueue")).catch(console.error);
    const member = interaction.member! as GuildMember;
    if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");

    let songs = queue.songs;

    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }

    queue.songs = songs;

    interaction.reply(i18n.__mf("shuffle.result", { author: member })).catch(console.error);
  }
};
