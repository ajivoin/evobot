import move from "array-move";
import { CommandInteraction, GuildMember } from "discord.js";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { bot } from "../index";
import { SlashCommandBuilder, SlashCommandIntegerOption } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("move")
          .setDescription(i18n.__("move.description"))
          .addIntegerOption(
            new SlashCommandIntegerOption()
              .setMinValue(1)
              .setName("s1")
              .setDescription("Song to move")
              .setRequired(true))
          .addIntegerOption(
            new SlashCommandIntegerOption()
              .setMinValue(1)
              .setName("s2")
              .setDescription("Location in queue to move song to")
              .setRequired(true)
          ),
  name: "move",
  aliases: ["mv"],
  description: i18n.__("move.description"),
  async execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("move.errorNotQueue")).catch(console.error);

    if (!canModifyQueue(interaction.member! as GuildMember)) return;

    const args: number[] = [interaction.options.getInteger("s1")!, interaction.options.getInteger("s2")!];

    if (!args.length) return interaction.reply(i18n.__mf("move.usagesReply", { prefix: "/" }));

    if (isNaN(args[0]) || args[0] <= 1)
      return interaction.reply(i18n.__mf("move.usagesReply", { prefix: "/" }));
    interaction.options.getInteger("s1");
    let song = queue.songs[args[0] - 1];

    queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);

    interaction.reply(
      i18n.__mf("move.result", {
        author: interaction.member,
        title: song.title,
        index: args[1] == 1 ? 1 : args[1]
      })
    );
  }
};
