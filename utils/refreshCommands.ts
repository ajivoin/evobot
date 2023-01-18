// @ts-nocheck

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Client } from "discord.js";
import { TOKEN } from "../config.json";
import { getSlashCommands } from "./getSlashCommands";

export const updateCommandsInGuild = async (client: Client, guildId: string) => {
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    const commands = getSlashCommands();
    console.log(`Started refreshing ${commands.length} application commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application commands.`);
    
  } catch (error) {
    console.error(error);
  }
}

export const updateGlobalCommands = async (client: Client) => {
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    const commands = getSlashCommands();
    console.log(`Started refreshing ${commands.length} global application commands.`)

    const data = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application commands.`);
  } catch (error) {
    console.error(error);
  }
}
