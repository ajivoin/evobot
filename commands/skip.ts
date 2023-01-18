import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { CommandInteraction, GuildMember } from "discord.js";
import { bot } from "../index";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("skip")
          .setDescription(i18n.__("skip.description")),
  name: "skip",
  aliases: ["s"],
  description: i18n.__("skip.description"),
  execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("skip.errorNotQueue")).catch(console.error);
    const member = interaction.member! as GuildMember;
    if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");

    queue.player.stop(true);

    interaction.reply(i18n.__mf("skip.result", { author: member })).catch(console.error);
  }
};
