import { CommandInteraction, GuildMember, Message } from "discord.js";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";
import { SlashCommandBuilder, SlashCommandIntegerOption } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("volume")
          .setDescription(i18n.__("volume.description"))
          .addIntegerOption(
            new SlashCommandIntegerOption()
              .setMinValue(1)
              .setMaxValue(100)
              .setName("value")
              .setDescription("Set to a number from 1 to 100.")
              .setRequired(true)
          ),
  name: "volume",
  aliases: ["v"],
  description: i18n.__("volume.description"),
  async execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("volume.errorNotQueue")).catch(console.error);
    const member = interaction.member! as GuildMember;
    if (!canModifyQueue(member))
      return interaction.reply(i18n.__("volume.errorNotChannel")).catch(console.error);
    const value = interaction.options.getInteger("value")!;

    queue.volume = value;
    queue.resource.volume?.setVolumeLogarithmic(value / 100);

    return interaction.reply(i18n.__mf("volume.result", { arg: value })).catch(console.error);
  }
};
