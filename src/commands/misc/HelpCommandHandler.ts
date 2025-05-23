import SlashCommandHandler from "@commands/SlashCommandHandler";
import Role, { getRoleValue, roleCommands } from "@lib/Role";
import { SlashCommandBuilder } from "discord.js";

// Builds the result of the help command
export default class HelpCommandHandler extends SlashCommandHandler{
    handle(): Promise<any> {
        let res: string[] = ['# Commands'];
        let seenRoles: Set<Role> = new Set<Role>();

        // Everyone will have these commands available
        res.push(roleCommands(Role.USER));

        let roleList: string[] = this.args.length > 0 ? this.args : this.roles;
        for (let i = 0; i < roleList.length; i++){
            let roleStr: string = roleList[i];
            let role: Role = getRoleValue(roleStr);
            if (role === Role.UnknownRole || seenRoles.has(role)) continue;
            res.push(roleCommands(role));
            seenRoles.add(role);
        }
        
        return Promise.resolve(seenRoles.size > 0 ? res.join("\n") : "No commands found for given roles"); // Return empty string if no roles were seen
    }

    public getDescription(): string{
        return "Returns a list of commands";
    }

    public getName(): string{
       return "help"; 
    }
}

export const cmdDefs: any[] = [
    new SlashCommandBuilder()
    .setName("help")
    .setDescription("Returns a list of commands")
    .addStringOption(option => 
        option.setName("role")
        .setDescription("The role to get help on")
        .setRequired(false)
    )
];
