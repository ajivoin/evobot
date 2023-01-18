import { CommandInteraction, GuildMember } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("resume")
          .setDescription(i18n.__("resume.description")),
  name: "resume",
  aliases: ["r"],
  description: i18n.__("resume.description"),
  execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("resume.errorNotQueue")).catch(console.error);
    const member = interaction.member! as GuildMember;
    if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");

    if (queue.player.unpause()) {
      interaction.reply(i18n.__mf("resume.resultNotPlaying", { author: member }))
        .catch(console.error);

      return true;
    }

    interaction.reply(i18n.__("resume.errorPlaying")).catch(console.error);
    return false;
  }
};
