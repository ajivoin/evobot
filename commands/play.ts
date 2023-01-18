import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember } from "discord.js";
import { bot } from "../index";
import { MusicQueue } from "../structs/MusicQueue";
import { Song } from "../structs/Song";
import { i18n } from "../utils/i18n";
import { playlistPattern } from "../utils/patterns";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("play")
          .setDescription(i18n.__("play.description"))
          .addStringOption(
            new SlashCommandStringOption()
              .setName("query")
              .setDescription("Song URL or search term")
              .setRequired(true)),
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: i18n.__("play.description"),
  permissions: ["CONNECT", "SPEAK", "ADD_REACTIONS", "MANAGE_MESSAGES"],
  async execute(interaction: CommandInteraction) {
    const member = interaction.member! as GuildMember;
    const { channel } = member.voice;

    if (!channel) return interaction.reply(i18n.__("play.errorNotChannel")).catch(console.error);

    const queue = bot.queues.get(interaction.guild!.id);

    if (queue && channel.id !== queue.connection.joinConfig.channelId)
      return interaction
        .reply(i18n.__mf("play.errorNotInSameChannel", { user: bot.client.user!.username }))
        .catch(console.error);

    const args: string[] = [interaction.options.getString("query")!];

    if (!args.length) return interaction.reply(i18n.__mf("play.usageReply", { prefix: "/" })).catch(console.error);

    const url = args[0];

    await interaction.reply("⏳ Loading...");

    // Start the playlist if playlist url was provided
    if (playlistPattern.test(args[0])) {
      await interaction.editReply("Please use the `playlist` command.");
      return bot.commands.get("playlist")!.execute(interaction, args);
    }

    let song;

    try {
      song = await Song.from(url, args.join(" "));
    } catch (error) {
      console.error(error);
      return interaction.editReply(i18n.__("common.errorCommand")).catch(console.error);
    }

    if (queue) {
      queue.enqueue(song);

      return interaction
        .editReply(i18n.__mf("play.queueAdded", { title: song.title, author: member }))
        .catch(console.error);
    }

    const newQueue = new MusicQueue({
      interaction: interaction,
      connection: joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
      })
    });

    bot.queues.set(interaction.guild!.id, newQueue);

    newQueue.enqueue(song);
  }
};
