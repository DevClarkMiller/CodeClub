import { User, GuildMember, Snowflake, Collection, GuildMemberRoleManager, Role as DiscordRole } from "discord.js";
import Role, { RoleError, getRoleName, getRoleValue, roleCommands }  from "./Role";

// Handlers
import CommandHandler from "./CommandHandler";
import SlashCommandHandler from "./SlashCommandHandler";
import HelpCommandHandler from "./HelpCommandHandler";
import { AddRoleCommandHandler, RemoveRoleCommandHandler } from "./RoleCommandHandler";
import { CreateGymCommandHandler } from "./GymCommandHandler";

class UnknownCommandHandler implements CommandHandler{
    handle(): Promise<any> {
        console.log('Unknown command');
        // throw new Error("UnknownCommand");
        return Promise.resolve();
    }
}

export function commandFactory(account: User, member: GuildMember | null, commandName: string, args: any): CommandHandler{
    switch(commandName){
        case "addRole": return new AddRoleCommandHandler(account, member, args);
        case "removeRole": return new RemoveRoleCommandHandler(account, member, args);
        case "help": return new HelpCommandHandler(account, member, args);
        case "createGym": return new CreateGymCommandHandler(account, member, args);
        default: return new UnknownCommandHandler();
    }
}