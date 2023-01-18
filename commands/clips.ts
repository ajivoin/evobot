import { i18n } from "../utils/i18n";
import { readdir } from "fs";
import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("clips")
          .setDescription(i18n.__("clips.description")),
  name: "clips",
  description: i18n.__("clips.description"),
  async execute(interaction: CommandInteraction) {
    readdir("./sounds", function (err, files) {
      if (err) return console.log("Unable to read directory: " + err);

      let clips: string[] = [];

      files.forEach(function (file) {
        clips.push(file.substring(0, file.length - 4));
      });

      interaction.reply(`${clips.join(" ")}`).catch(console.error);
    });
  }
};
