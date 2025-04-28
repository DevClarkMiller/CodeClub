import { StringSelectMenuBuilder, User, GuildMember, Guild } from "discord.js";

export interface CommandHandler{
    handle(): void;
}

export abstract class SlashCommandHandler implements CommandHandler{
    protected account: User;
    protected member: GuildMember | null;
    protected args: any;
    
    public constructor(account: User, member: GuildMember | null, args: any){
        this.account = account;
        this.member = member;
        this.args = args;
    }

    abstract handle(): void;
}

export class RankCommandHandler extends SlashCommandHandler{
    handle(): void {
        console.log(this.account, this.args, this.member?.roles.cache.map(role => role.name));
    }
} 

export class UnknownCommandHandler implements CommandHandler{
    handle(): void {
        console.log('Unknown command');
        // throw new Error("UnknownCommand");
    }
}

export function commandFactory(account: User, member: GuildMember | null, commandName: string, args: any): CommandHandler{
    switch(commandName){
        case "rank": return new RankCommandHandler(account, member, args);
        default: return new UnknownCommandHandler();
    }
}