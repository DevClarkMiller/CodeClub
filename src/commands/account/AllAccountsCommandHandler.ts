import { GuildMember, User} from "discord.js";

import SlashCommandHandler from "@commands/SlashCommandHandler";
import Role from "@lib/Role";
import AccountDao from "@dao/accountDao";
import { Account } from "@generated/prisma";
import AccountEloDao from "@dao/accountEloDao";

export default class AllAccountsCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.ADMIN);
    }

    async handle(): Promise<any> {
        const accDao: AccountDao = new AccountDao();
        const accEloDao: AccountEloDao = new AccountEloDao();
        const allAccounts: Account[] = await accDao.getAll();

        let res: string[] = ["# All Accounts"];
        for (const account of allAccounts){
            try{
                let member: GuildMember | undefined = await this.member?.guild.members.fetch(account.DiscordUsername);
                let totalElo: number = await accEloDao.totalEloForAccount(account);
                if (member)
                    res.push(`- ${member.displayName} - ${totalElo}`);
            }catch(err: any){} // Something unknown went wrong, so just skip this account
        }

        return res.join('\n');
    }
    
    public getDescription(): string{
        return "Lists off every account with their elo that's in the database";
    }

    public getName(): string{
       return "allaccounts"; 
    }
}