import { CommandInteraction, GuildMember, Message, MessageEmbed, TextChannel } from "discord.js";
import youtube from "youtube-sr";
import { bot } from "../index";
import { i18n } from "../utils/i18n";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";

type CustomTextChannel = TextChannel & { activeCollector: boolean };

export default {
  data: new SlashCommandBuilder()
          .setName("search")
          .setDescription(i18n.__("search.description"))
          .addStringOption(
            new SlashCommandStringOption()
              .setRequired(true)
              .setName("query")
              .setDescription("Search query")
          ),
  name: "search",
  description: i18n.__("search.description"),
  async execute(interaction: CommandInteraction) {


    if ((interaction.channel as CustomTextChannel).activeCollector)
      return interaction.reply(i18n.__("search.errorAlreadyCollector"));

    const member = interaction.member! as GuildMember;

    if (!member.voice.channel) return interaction.reply(i18n.__("search.errorNotChannel")).catch(console.error);

    const search = interaction.options.getString("query")!;

    let resultsEmbed = new MessageEmbed()
      .setTitle(i18n.__("search.resultEmbedTitle"))
      .setDescription(i18n.__mf("search.resultEmbedDesc", { search: search }))
      .setColor("#F8AA2A");

    try {
      const results = await youtube.search(search, { limit: 10, type: "video" });

      results.map((video, index) =>
        resultsEmbed.addField(`https://youtube.com/watch?v=${video.id}`, `${index + 1}. ${video.title}`)
      );

      await interaction.reply({ embeds: [resultsEmbed] });

      const filter = (msg: Message) => {
        const pattern = /^[1-9][0]?(\s*,\s*[1-9][0]?)*$/;
        return pattern.test(msg.content);
      }

      (interaction.channel as CustomTextChannel).activeCollector = true;

      const response = await interaction.channel!.awaitMessages({ filter, max: 1, time: 30000, errors: ["time"] });
      const reply = response.first()!.content;

      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());

        for (let song of songs) {
          await bot.commands.get("play")!.execute(interaction, [resultsEmbed.fields[parseInt(song) - 1].name]);
        }
      } else {
        const choice: any = resultsEmbed.fields[parseInt(response.first()?.toString()!) - 1].name;
        bot.commands.get("play")!.execute(interaction, [choice]);
      }

      (interaction.channel as CustomTextChannel).activeCollector = false;
      response.first()!.delete().catch(console.error);
    } catch (error: any) {
      console.error(error);
      (interaction.channel as CustomTextChannel).activeCollector = false;
      interaction.reply(i18n.__("common.errorCommand")).catch(console.error);
    }
  }
};
