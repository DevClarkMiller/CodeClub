import SlashCommandHandler from "./SlashCommandHandler";
import Role, { getRoleName, getRoleValue, roleCommands } from "./Role";

// Builds the result of the help command
export default class HelpCommandHandler extends SlashCommandHandler{
    handle(): Promise<any> {
        let res = '# Commands\n';
        let seenRoles: Set<Role> = new Set<Role>();
        console.log(this.roles);
        for (let i = 0; i < this.roles.length; i++){
            let roleStr: string = this.roles[i];
            let role: Role = getRoleValue(roleStr);
            if (seenRoles.has(role)) continue;
            res += roleCommands(role);
            seenRoles.add(role);
        }

        return Promise.resolve(res);
    }
}