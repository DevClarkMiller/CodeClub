import SlashCommandHandler from "@commands/SlashCommandHandler";
import { Guild, GuildMember, User } from "discord.js";
import Role from "@lib/Role";
import { Account } from "@generated/prisma";
import AccountDao from "@dao/accountDao";
import AccountEloDao from "@dao/accountEloDao";

export default class ResetAllEloCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.ADMIN);
    }

    public async handle(): Promise<any> {
        try{
            const accDao: AccountDao = new AccountDao();
            const accEloDao: AccountEloDao = new AccountEloDao();
            const accounts: Account[] = await accDao.getAll(); // Fetch every account
            
            await accEloDao.deleteMany(null); // Delete all accountElo records

            // Now loop over all the accounts, and add 1000 elo to the accounts, and update their labels as well
            for(const account of accounts){
                try{
                    // Get their guild member object
                    const member: GuildMember | undefined = await this.member?.guild.members.fetch(account.DiscordUsername);
                    if (!member) continue;
                    
                    // Now you can give them the 1000 elo, and update their nickname
                    await accEloDao.add({AccountID: account.ID, Total: 1000});
                    await accDao.updateNickname(account, member);

                }catch(err: any){}
            }

            return "Successfully reset all elo";
        }catch(err: any){
            console.error(err.message);
            return "Couldn't reset all elo, please try again";
        }
    }
}