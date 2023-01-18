import { readdir, readdirSync, readFile } from "fs";
import { join } from "path";

export const getSlashCommands = () => {
  const commands = [];
  const commandFiles = readdirSync(join(__dirname, "..", "commands")).filter((file) => !file.endsWith(".map"));
  
  for (const file of commandFiles) {
    const command = require(join(__dirname, "..", "commands", file)).default;
    if (command.data && command.execute) {
      commands.push(command.data.toJSON());
    }
  }

  return commands;
}
