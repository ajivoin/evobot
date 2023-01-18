import { MessageEmbed, CommandInteraction } from "discord.js";
import { i18n } from "../utils/i18n";
import { bot } from "../index";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("help")
          .setDescription(i18n.__("help.description")),
  name: "help",
  aliases: ["h"],
  description: i18n.__("help.description"),
  async execute(interaction: CommandInteraction) {
    let commands = bot.commands;

    let helpEmbed = new MessageEmbed()
      .setTitle(i18n.__mf("help.embedTitle", { botname: interaction.client.user!.username }))
      .setDescription(i18n.__("help.embedDescription"))
      .setColor("#F8AA2A");
    
    commands.forEach((cmd) => {
      helpEmbed.addFields(
        { 
          name: `**/${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
          value:`${cmd.description}`,
          inline: true
        }
      );
    });

    helpEmbed.setTimestamp();

    return interaction.reply({ embeds: [helpEmbed], ephemeral: true }).catch(console.error);
  }
};
