import CommandHandler from "./CommandHandler";
import { User, GuildMember } from "discord.js";

import Role, { RoleError } from "../lib/Role";

export default abstract class SlashCommandHandler implements CommandHandler{
    protected account: User;
    protected member: GuildMember | null;
    protected args: string[];
    protected roles: string[] = [];
    
    public constructor(account: User, member: GuildMember | null, args: any, role?: Role){
        this.account = account;
        this.member = member;
        this.args = args;

        if (this.member)
            this.roles = this.member.roles.cache.map(role => role.name);

        switch(role){
            case Role.ADMIN:
                if (!this.roles.includes("Admin")) throw new RoleError(`Couldn't finish command, ${this.account.displayName} must be an admin`);
        }
    }

    public parseArgs(): Map<string, string>{
        let vals = new Map<string, string>();

        let i = 0;
        while (i < this.args.length){
            if (this.args[i].substring(0, 2) == "--"){
                vals.set(this.args[i].substring(2, this.args[i].length).toLowerCase(), this.args[++i]);
            }
            i++;
        }

        return vals;
    }

    abstract handle(): Promise<any>;
}