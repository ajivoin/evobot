import { CommandInteraction, GuildMember, Interaction, Message, MessageEmbed } from "discord.js";
import { i18n } from "../utils/i18n";
import { bot } from "../index";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("grab")
          .setDescription(i18n.__("grab.description")),
  name: "grab",
  description: i18n.__("grab.description"),
  async execute(interaction: CommandInteraction) {
    const queue = bot.queues.get(interaction.guild!.id);

    if (!queue || !queue.songs.length)
      return interaction.reply(i18n.__("nowplaying.errorNotQueue")).catch(console.error);

    const song = queue.songs[0];

    let nowPlaying = new MessageEmbed()
      .setTitle(i18n.__("nowplaying.embedTitle"))
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A");
    const member: GuildMember = interaction.member! as GuildMember;

    interaction.reply({ content: 'Song sent to your DMs! 📬', ephemeral: true});

    return member.send({ embeds: [nowPlaying] })
      .catch(console.error);
  }
};
