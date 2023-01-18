import { CommandInteraction, GuildMember, Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { bot } from "../index";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("queue")
          .setDescription(i18n.__("queue.description")),
  name: "queue",
  cooldown: 5,
  aliases: ["q"],
  description: i18n.__("queue.description"),
  permissions: ["MANAGE_MESSAGES", "ADD_REACTIONS"],
  async execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);
    if (!queue || !queue.songs.length) return interaction.reply(i18n.__("queue.errorNotQueue"));

    let currentPage = 0;
    const embeds = generateQueueEmbed(interaction, queue.songs);

    await interaction.reply({
      content: `**${i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
      embeds: [embeds[currentPage]]
    });

    const queueEmbed = await interaction.fetchReply() as Message;

    try {
      await queueEmbed.react("⬅️");
      await queueEmbed.react("⏹");
      await queueEmbed.react("➡️");
    } catch (error: any) {
      console.error(error);
      interaction.reply(error.message).catch(console.error);
    }

    const member = interaction.member! as GuildMember;

    const filter = (reaction: MessageReaction, user: User) =>
      ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name!) && member.id === user.id;

    const collector = queueEmbed.createReactionCollector({ filter, time: 60000 });

    collector.on("collect", async (reaction, user) => {
      try {
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit({
              content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
              embeds: [embeds[currentPage]]
            });
          }
        } else if (reaction.emoji.name === "⬅️") {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit({
              content: i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
              embeds: [embeds[currentPage]]
            });
          }
        } else {
          collector.stop();
          reaction.message.reactions.removeAll();
        }
        await reaction.users.remove(member.id);
      } catch (error: any) {
        console.error(error);
        return interaction.reply(error.message).catch(console.error);
      }
    });
  }
};

function generateQueueEmbed(interaction: CommandInteraction, songs: Song[]) {
  let embeds = [];
  let k = 10;

  for (let i = 0; i < songs.length; i += 10) {
    const current = songs.slice(i, k);
    let j = i;
    k += 10;

    const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

    const embed = new MessageEmbed()
      .setTitle(i18n.__("queue.embedTitle"))
      .setThumbnail(interaction.guild?.iconURL()!)
      .setColor("#F8AA2A")
      .setDescription(
        i18n.__mf("queue.embedCurrentSong", { title: songs[0].title, url: songs[0].url, info: info })
      )
      .setTimestamp();
    embeds.push(embed);
  }

  return embeds;
}
