import { CommandInteraction, GuildMember } from "discord.js";
import { bot } from "../index";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { canModifyQueue } from "../utils/queue";
import { SlashCommandBuilder, SlashCommandIntegerOption } from "@discordjs/builders";

const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

export default {
  data: new SlashCommandBuilder()
          .setName("remove")
          .setDescription(i18n.__("remove.description"))
          .addIntegerOption(
            new SlashCommandIntegerOption()
              .setMinValue(1)
              .setName("index")
              .setDescription("Index in queue")
              .setRequired(true)
          ),
  name: "remove",
  aliases: ["rm"],
  description: i18n.__("remove.description"),
  execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue) return interaction.reply(i18n.__("remove.errorNotQueue")).catch(console.error);

    const member = interaction.member! as GuildMember;

    if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
    
    const index = interaction.options.getInteger("index")!;

    if (index <= queue.songs.length) {
      return interaction.reply(
        i18n.__mf("remove.result", {
          title: queue.songs.splice(index - 1, 1)[0].title,
          author: member.id
        })
      );
    } else {
      return interaction.reply(i18n.__mf("remove.usageReply", { prefix: "/" }));
    }
  }
};
