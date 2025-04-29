import { User, GuildMember, Snowflake, Collection, GuildMemberRoleManager, Role as DiscordRole } from "discord.js";
import CommandHandler from "./CommandHandler";

enum Role{
    ADMIN = 1,
    USER = 2,

    // For testing
    TestRole = 3,
}

export class RoleError extends Error{
    constructor(msg: string){
        super(msg);
    }
}

function getRoleValue(role: string): Role{
    switch(role){
        case "Admin": return Role.ADMIN;
        case "User": return Role.USER;
        default: return Role.USER;
    }
}

function getRoleName(role: Role): string{
    switch(role){
        case Role.USER: return "User";
        case Role.ADMIN: return "Admin";
        case Role.TestRole: return "TestRole";
        default: return "";   
    }
}

function roleCommands(role: Role){
    let res: string = ""; // Res is built onto from the role, this is done for clarity

    switch(role){
        case Role.ADMIN:
            res += "## /addRole --user USER --role ROLE $ Assigns the given user the specified role\n";
            res += "## /removeRole --user USER --role ROLE $ Removes role from the given user\n";
            break;
        case Role.USER: 
            res += '## /help $ Returns a list of commands\n';
            break;
    }

    return res
}

// function getRoleID(role: Role, roles: GuildMemberRoleManager): string {
//     let roleName: string = getRoleName(role);
//     const discRole: DiscordRole | undefined = roles.cache.find(discRole => discRole.name === roleName);
//     if (!discRole) return "";
//     return discRole.id;
// }

abstract class SlashCommandHandler implements CommandHandler{
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

    abstract handle(): Promise<any>;
}

const ROLE_ERR_DEFAULT = "Couldn't give role to user, please see /help for the command layout";

abstract class RoleCommandHandler extends SlashCommandHandler{
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

class AddRoleCommandHandler extends RoleCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.ADMIN);
    }

    async handle(): Promise<any> {
        return this.alterRole("Role added to person", async (member, roleID) => await member.roles.add(roleID));
    }
}

class RemoveRoleCommandHandler extends RoleCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.ADMIN);
    }

    async handle(): Promise<any> {
        return this.alterRole("Role removed from person", async (member, roleID) => await member.roles.remove(roleID));
    }
}

// Builds the result of the help command
class HelpCommandHandler extends SlashCommandHandler{
    handle(): Promise<any> {
        let res = '# Commands\n';
        let seenRoles: Set<Role> = new Set<Role>();
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

// This will be tough, will have to use puppeteer and manually click through fields to get it, or use selenium.
class CreateGymCommandHandler extends SlashCommandHandler{
    handle(): Promise<any> {
        return Promise.resolve("GOING TO CREATE GYM");
    }
}

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