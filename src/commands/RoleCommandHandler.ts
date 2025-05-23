import SlashCommandHandler from "./SlashCommandHandler";
import { User, GuildMember, Snowflake, Collection, GuildMemberRoleManager, Role as DiscordRole, SlashCommandBuilder } from "discord.js";
import Role from "../lib/Role";

const ERR_DEFAULT = "Couldn't give role to user, please see /help for the command layout";

export abstract class RoleCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any, override: boolean = false){
        // Means no permissions are required for this command
        if (override) super(account, member, args);
        else super(account, member, args, Role.ADMIN);
    }

    abstract handle(): Promise<any>;

    protected async getRoleID(member: GuildMember, role: string): Promise<string | undefined>{
        const discRole: DiscordRole | undefined = member.guild.roles.cache.find((rol: DiscordRole) => rol.name === role);
        return discRole?.id;
    }

    protected async alterRole(msg: string, callback: (_member: GuildMember, _roleID: string) => Promise<GuildMember>){
        if (!this.member?.roles.cache.find(r => r.name === "Admin")) return Promise.resolve(`Couldn't give role to user, ${this.account.displayName} doesn't have the correct perms`);

        let parsedArgs = this.parseArgs();
        const userID: string | undefined = parsedArgs.get("userid");
        const role: string | undefined = parsedArgs.get("role");

        if (!userID || !role) return ERR_DEFAULT;

        const member: GuildMember | null = await this.member.guild.members.fetch(userID);
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

    public getDescription(): string{
        return "Assigns the given user the specified role";
    }

    public getName(): string{
       return "addrole"; 
    }
}

export class RemoveRoleCommandHandler extends RoleCommandHandler{
    async handle(): Promise<any> {
        return this.alterRole("Role removed from person", async (member, roleID) => await member.roles.remove(roleID));
    }

    public getDescription(): string{
        return "Removes role from the given user";
    }

    public getName(): string{
       return "removerole"; 
    }
}

export const cmdDefs: any[] = [
    new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Assigns the given user the specified role")
    .addStringOption(option => 
        option.setName("userid")
        .setDescription("The userid to give the role to")
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("role")
        .setDescription("The role to be assigned").
        setRequired(true)
    ),

    new SlashCommandBuilder()
    .setName("removerole")
    .setDescription("Removes role from the given user")
    .addStringOption(option => 
        option.setName("userid")
        .setDescription("The userid to remove the role from")
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName("role")
        .setDescription("The role to be removed").
        setRequired(true)
    )
];