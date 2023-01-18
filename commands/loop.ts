import { CommandInteraction, GuildMember } from "discord.js";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("loop")
          .setDescription(i18n.__("loop.description")),
  name: "loop",
  aliases: ["l"],
  description: i18n.__("loop.description"),
  async execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("loop.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(interaction.member! as GuildMember)) return i18n.__("common.errorNotChannel");

    queue.loop = !queue.loop;

    return interaction
      .reply(i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") }))
      .catch(console.error);
  }
};
