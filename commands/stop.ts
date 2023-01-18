import { CommandInteraction, GuildMember } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("stop")
          .setDescription(i18n.__("stop.description")),
  name: "stop",
  description: i18n.__("stop.description"),
  async execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("stop.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(interaction.member! as GuildMember)) return i18n.__("common.errorNotChannel");

    queue.stop();

    interaction.reply(i18n.__mf("stop.result", { author: interaction.member })).catch(console.error);
  }
};
