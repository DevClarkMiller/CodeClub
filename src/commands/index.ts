import { User, GuildMember} from "discord.js";

// Handlers
import CommandHandler from "./CommandHandler";
import HelpCommandHandler from "@commands/misc/HelpCommandHandler";
import { AddRoleCommandHandler, RemoveRoleCommandHandler } from "./RoleCommandHandler";
import { CreateGymCommandHandler } from "./gym/CreateGymCommandHandler";
import { StatsGymCommandHandler } from './gym/StatsGymCommandHandler';
import AddAllAccountsCommandHandler from "./account/AddAllAccountsCommandHandler";
import AddAccountCommandHandler from "./account/AddAccountCommandHandler";
import ToggleShowELOCommandHandler from "./elo/ToggleShowELOCommandHandler";
import TotalELOCommandHandler from "./elo/TotalELOCommandHandler";
import UpdateELOTagsCommandHandler from "./elo/UpdateELOTagsCommandHandler";
import SetSiteUsernameCommandHandler from "./account/SetSiteUsernameCommandHandler";
import SyncContestEloCommandHandler from "./elo/SyncContestEloCommandHandler";

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
        case "addRole": return new AddRoleCommandHandler(account, member, args);
        case "removeRole": return new RemoveRoleCommandHandler(account, member, args);
        case "help": return new HelpCommandHandler(account, member, args);
        case "createGym": return new CreateGymCommandHandler(account, member, args);
        case "statsGym": return new StatsGymCommandHandler(account, member, args);
        case "addAllAccounts": return new AddAllAccountsCommandHandler(account, member, args);
        case "addAccount": return new AddAccountCommandHandler(account, member, args);
        case "toggleShowELO": return new ToggleShowELOCommandHandler(account, member, args);
        case "elo": return new TotalELOCommandHandler(account, member, args);
        case "updateEloTags": return new UpdateELOTagsCommandHandler(account, member, args);
        case "setSiteUsername": return new SetSiteUsernameCommandHandler(account, member, args);
        case "syncContestElo": return new SyncContestEloCommandHandler(account, member, args);
        default: return new UnknownCommandHandler();
    }
}