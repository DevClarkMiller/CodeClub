import Dao from "./dao";
import PrismaSingleton from "@lib/prismaSingleton";
import { Account } from "@generated/prisma";
import AccountEloDao from "./accountEloDao";
import { User, GuildMember, Snowflake, Collection, GuildMemberRoleManager, Role as DiscordRole, Guild } from "discord.js";
import { config } from "@config";
export default class AccountDao extends Dao<
  Account,
  typeof PrismaSingleton.instance.account> 
  {
    public constructor() { super(PrismaSingleton.instance.account); }

    public async getByUsername(username: string): Promise<Account | null>{
        try{
            return await PrismaSingleton.instance.account.findFirst({where: {DiscordUsername: username}});
        }catch(err: any){
            console.error(`Couldn't get by username: ${err.message}`);
            return null;
        }
    }

    public async getByCodeforcesUsername(username: string): Promise<Account | null>{
        try{
            return await PrismaSingleton.instance.account.findFirst({where: {CodeforcesUsername: username}});
        }catch(err: any){
            console.error(`Couldn't get by username: ${err.message}`);
            return null;
        }
    }

    public async updateNickname(account: Account, member: GuildMember | null): Promise<void>{
        if (!member || member.user.id === config.OWNER_USERNAME) return; // Can't rename the owner   
        await member.setNickname(null); // Resets their nickname back to the original
        if (!account.ShowElo) return; // Means the user doesn't want their elo displayed anymore

        const accEloDao: AccountEloDao = new AccountEloDao();
        const totalPoints: number = await accEloDao.totalEloForAccount(account);
                    
        member.setNickname(`${member.displayName} *${totalPoints}`);
    }
    
    public async toggleShowElo(account: Account, member: GuildMember | null, toggleState: -1 | 0 | 1 = -1): Promise<void>{
        try{
            let showElo: boolean = account?.ShowElo;
            if (toggleState == -1)
                showElo = !showElo;
            else if (toggleState == 0)
                showElo = false
            else 
                showElo = true
            account = await PrismaSingleton.instance.account.update({data: {
                ShowElo: showElo
            },where: {ID: account.ID}});

            // Now change the nickname of the user if it's toggled and if member isn't null
            this.updateNickname(account, member);
        }catch(err: any){
            console.error(`Couldn't toggle elo: ${err.message}`);
        }
    }

    public async updateGuildElo(guild: Guild): Promise<void>{
        try{
            for (const member of guild.members.cache.values()){
                const account: Account | null = await this.getByUsername(member.user.id);
                if (!account) continue;
                await this.updateNickname(account, member);
            }
        }catch(err: any){
            console.error(`Encountered an error while updating guild elo: ${err.message}`);
            throw err;
        }
    }

    public async add(account: any, member: GuildMember | null = null): Promise<Account>{
        try{
            const newAccount: Account = await super.add(account);
            const accEloDao: AccountEloDao = new AccountEloDao();

            // Now add the initial 1000 points
            accEloDao.add({Total: 1000, AccountID: newAccount.ID});
            return newAccount;
        }catch(err: any){
            console.error(`Error while creating account: ${err.message}`);
            throw err;
        }
    }
}