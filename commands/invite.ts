import { CommandInteraction, GuildMember } from "discord.js";
import { i18n } from "../utils/i18n";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("invite")
          .setDescription(i18n.__("invite.description")),
  name: "invite",
  description: i18n.__("invite.description"),
  async execute(interaction: CommandInteraction) {
    const member = interaction.member! as GuildMember;
    return member.send(
        `https://discord.com/oauth2/authorize?client_id=${
          interaction.client.user!.id
        }&permissions=70282305&scope=bot
    `
      )
      .catch(console.error);
  }
};
