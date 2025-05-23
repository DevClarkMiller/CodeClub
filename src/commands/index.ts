import { User, GuildMember, SlashCommandBuilder, RESTPostAPIChatInputApplicationCommandsJSONBody} from "discord.js";

// Handlers
import CommandHandler from "./CommandHandler";
import HelpCommandHandler from "@commands/misc/HelpCommandHandler";
import { AddRoleCommandHandler, RemoveRoleCommandHandler } from "./RoleCommandHandler";
import AddAllAccountsCommandHandler from "./account/AddAllAccountsCommandHandler";
import AddAccountCommandHandler from "./account/AddAccountCommandHandler";
import ToggleShowELOCommandHandler from "./elo/ToggleShowELOCommandHandler";
import TotalELOCommandHandler from "./elo/TotalELOCommandHandler";
import UpdateELOTagsCommandHandler from "./elo/UpdateELOTagsCommandHandler";
import SetSiteUsernameCommandHandler from "./account/SetSiteUsernameCommandHandler";
import SyncContestEloCommandHandler from "./elo/SyncContestEloCommandHandler";
import { SyncGymEloCommandHandler } from "./gym/SyncGymEloCommandHandler";
import PreviouslySyncedCommandHandler from "./misc/PreviouslySyncedCommandHandler";
import EloHistoryCommandHandler from "./elo/EloHistoryCommandHandler";
import AllAccountsCommandHandler from "./account/AllAccountsCommandHandler";
import WipeDBCommandHandler from "./misc/WipeDBCommandHandler";
import ResetAllEloCommandHandler from "./elo/ResetAllEloCommandHandler";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";

// Does nothing probably means this command was for another bot
class UnknownCommandHandler implements CommandHandler{
    handle(): Promise<any> {
        return Promise.resolve();
    }
}

/**
 * Brief: Returns a CommandHandlder based off the slash command said by a user
 * @param account 
 * @param member 
 * @param commandName 
 * @param args 
 * @returns 
 */
export function commandFactory(account: User, member: GuildMember | null, commandName: string, args: any): CommandHandler{
    switch(commandName){
        case "addrole": return new AddRoleCommandHandler(account, member, args);
        case "removerole": return new RemoveRoleCommandHandler(account, member, args);
        case "help": return new HelpCommandHandler(account, member, args);
        case "addallaccounts": return new AddAllAccountsCommandHandler(account, member, args);
        case "addaccount": return new AddAccountCommandHandler(account, member, args);
        case "allaccounts": return new AllAccountsCommandHandler(account, member, args);
        case "toggleshowelo": return new ToggleShowELOCommandHandler(account, member, args);
        case "elo": return new TotalELOCommandHandler(account, member, args);
        case "elohistory": return new EloHistoryCommandHandler(account, member, args);
        case "updateelotags": return new UpdateELOTagsCommandHandler(account, member, args);
        case "setsiteusername": return new SetSiteUsernameCommandHandler(account, member, args);
        case "synccontestelo": return new SyncContestEloCommandHandler(account, member, args);
        case "syncgymelo": return new SyncGymEloCommandHandler(account, member, args);
        case "previouslysynced": return new PreviouslySyncedCommandHandler(account, member, args);
        case "wipedb": return new WipeDBCommandHandler(account, member, args);
        case "resetallelo": return new ResetAllEloCommandHandler(account, member, args);
        default: return new UnknownCommandHandler();
    }
}
mm
function getAllFiles(dir: string, ext: string = ".ts", files: string[] = []): string[]{
    for (const file of readdirSync(dir)){
        const path = join(dir, file);
        const stat = statSync(path);

        if (stat.isDirectory()){
            getAllFiles(path, ext, files); // recursively gets the rest of the files
        } else if(path.endsWith(ext)){
            files.push(path);
        }
    }

    return files;
}

// Dynamically import all commands from the commands folder
export async function loadCommands(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]>{
    const files: string[] = getAllFiles(__dirname);
    let commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    
    for (const file of files){
        const fileUrl = pathToFileURL(file).href; // Without this, the files can't be imported
        const module = await import(fileUrl);

        // Merge the jsonified command definitions
        if (module.cmdDefs)
            commands = [...commands, ...(module.cmdDefs as SlashCommandBuilder[]).map(cmd => cmd.toJSON())]; // Merge the two arrays
    }

    return commands;
}