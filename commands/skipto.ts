import { canModifyQueue } from "../utils/queue";
import { i18n } from "../utils/i18n";
import { CommandInteraction, GuildMember, Message } from "discord.js";
import { bot } from "../index";
import { SlashCommandBuilder, SlashCommandIntegerOption } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("skipto")
          .setDescription(i18n.__("skipto.description"))
          .addIntegerOption(
            new SlashCommandIntegerOption()
              .setRequired(true)
              .setName("index")
              .setDescription("Index in queue to skip to")
          ),
  name: "skipto",
  aliases: ["st"],
  description: i18n.__("skipto.description"),
  async execute(interaction: CommandInteraction) {
    const index = interaction.options.getInteger("index")!; 

    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("skipto.errorNotQueue")).catch(console.error);
    const member = interaction.member! as GuildMember;
    if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");

    if (index > queue.songs.length)
      return interaction
        .reply(i18n.__mf("skipto.errorNotValid", { length: queue.songs.length }))
        .catch(console.error);

    if (queue.loop) {
      for (let i = 0; i < index - 2; i++) {
        queue.songs.push(queue.songs.shift()!);
      }
    } else {
      queue.songs = queue.songs.slice(index - 2);
    }

    queue.player.stop();

    interaction
      .reply(i18n.__mf("skipto.result", { author: member, arg: index - 1 }))
      .catch(console.error);
  }
};
