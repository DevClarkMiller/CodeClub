import SlashCommandHandler from "./SlashCommandHandler";
import { User, GuildMember, Snowflake, Collection, GuildMemberRoleManager, Role as DiscordRole } from "discord.js";
import Role from "../lib/Role";

const ROLE_ERR_DEFAULT = "Couldn't give role to user, please see /help for the command layout";

export abstract class RoleCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.ADMIN);
    }

    abstract handle(): Promise<any>;

    protected getUserAndRole(): {user: string, role: string} | null{
        if (this.args.length < 4) return null;

        let user: string = "";
        let role: string = "";

        let i = 0;
        while (i < this.args.length){
            if (this.args[i].toLowerCase() === "--user"){
                i++;
                user = this.args[i];
            }else if(this.args[i].toLowerCase() === '--role'){
                i++;
                role = this.args[i];
            }
            i++;
        }

        if (!user || !role) return null; 
        return { user, role };
    }

    protected async findMember(user: string): Promise<GuildMember | null>{
        if (!this.member) return null;
        let foundMember: Collection<Snowflake, GuildMember> = await this.member.guild.members.search({
            query: user,
            limit: 1
        });

        if (foundMember.size != 1) return null;
        return foundMember.get(foundMember.firstKey() as string)as GuildMember;
    }

    protected async getRoleID(member: GuildMember, role: string): Promise<string | undefined>{
        const discRole: DiscordRole | undefined = member.guild.roles.cache.find((rol: DiscordRole) => rol.name === role);
        return discRole?.id;
    }

    protected async alterRole(msg: string, callback: (_member: GuildMember, _roleID: string) => Promise<GuildMember>){
        if (!this.member?.roles.cache.find(r => r.name === "Admin")) return Promise.resolve(`Couldn't give role to user, ${this.account.displayName} doesn't have the correct perms`);

        const userAndRole = this.getUserAndRole();
        if (!userAndRole) return ROLE_ERR_DEFAULT;
 
        const user = userAndRole?.user;
        const role = userAndRole?.role;

        const member: GuildMember | null = await this.findMember(user);
        if (!member) return Promise.resolve("Member not found");
        const roleID: string | undefined = await this.getRoleID(member, role);
        if (!roleID) return Promise.resolve("Cannot give role, role doesn't exist");

        try{
            await callback(member, roleID);
        }catch(err: any){
            console.error(err);
        }

        return Promise.resolve(msg);
    }
}

export class AddRoleCommandHandler extends RoleCommandHandler{
    async handle(): Promise<any> {
        return this.alterRole("Role added to person", async (member, roleID) => await member.roles.add(roleID));
    }
}

export class RemoveRoleCommandHandler extends RoleCommandHandler{
    async handle(): Promise<any> {
        return this.alterRole("Role removed from person", async (member, roleID) => await member.roles.remove(roleID));
    }
}
