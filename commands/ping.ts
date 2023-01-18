import { CommandInteraction } from "discord.js";
import { i18n } from "../utils/i18n";
import { SlashCommandBuilder } from "@discordjs/builders";

export default {
  data: new SlashCommandBuilder()
          .setName("ping")
          .setDescription(i18n.__("ping.description")),
  name: "ping",
  cooldown: 10,
  description: i18n.__("ping.description"),
  async execute(interaction: CommandInteraction) {
    interaction
      .reply({ content: i18n.__mf("ping.result", { ping: Math.round(interaction.client.ws.ping) }), ephemeral: true})
      .catch(console.error);
  }
};
