import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";
import { CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("pause")
          .setDescription(i18n.__("pause.description")),
  name: "pause",
  description: i18n.__("pause.description"),
  async execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("pause.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(interaction.member! as GuildMember)) return i18n.__("common.errorNotChannel");

    if (queue.player.pause()) {
      interaction.reply(i18n.__mf("pause.result", { author: interaction.member })).catch(console.error);

      return true;
    }
  }
};
