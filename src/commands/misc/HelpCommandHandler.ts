import SlashCommandHandler from "@commands/SlashCommandHandler";
import Role, { getRoleName, getRoleValue, roleCommands } from "@lib/Role";

// Builds the result of the help command
export default class HelpCommandHandler extends SlashCommandHandler{
    handle(): Promise<any> {
        let res = '# Commands\n';
        let seenRoles: Set<Role> = new Set<Role>();

        let roleList: string[] = this.args.length > 0 ? this.args : this.roles;
        for (let i = 0; i < roleList.length; i++){
            let roleStr: string = roleList[i];
            let role: Role = getRoleValue(roleStr);
            if (role === Role.UnknownRole || seenRoles.has(role)) continue;
            res += roleCommands(role) + '\n';
            seenRoles.add(role);
        }
        
        return Promise.resolve(seenRoles.size > 0 ? res : "No commands found for given roles"); // Return empty string if no roles were seen
    }
}