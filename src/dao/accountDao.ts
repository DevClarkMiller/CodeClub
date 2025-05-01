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

    public async getByDisplayName(username: string, guild: Guild): Promise<Account | null>{
        if (!guild) return null;
        let foundMember: Collection<Snowflake, GuildMember> = await guild.members.search({
            query: username,
            limit: 1
        });

        if (foundMember.size != 1) return null;
        const foundGuildMember: GuildMember = foundMember.get(foundMember.firstKey() as string) as GuildMember;
        const account: Account | null = await this.getByUsername(foundGuildMember.user.username);
        return account;
    }

    public async toggleShowElo(account: Account, member: GuildMember | null): Promise<void>{
        try{
            account = await PrismaSingleton.instance.account.update({data: {
                ShowElo: !account?.ShowElo
            },where: {ID: account.ID}});

            // Now change the nickname of the user if it's toggled and if member isn't null
            if (!member || member.user.username === config.OWNER_USERNAME) return; // Can't rename the owner   
            if (!account.ShowElo){ 
                
                member.setNickname(member.displayName);
                return;
            }

            const accEloDao: AccountEloDao = new AccountEloDao();
            const totalPoints: number = await accEloDao.totalPointsForAccount(account);
                     
            member.setNickname(`${member.displayName} *${totalPoints}`);
        }catch(err: any){
            console.error(`Couldn't toggle elo: ${err.message}`);
        }
    }

    public async add(account: any): Promise<Account>{
        try{
            const newAccount: Account = await super.add(account);
            // Now add the initial 1000 points
            const accEloDao: AccountEloDao = new AccountEloDao();
            accEloDao.add({Total: 1000, AccountID: newAccount.ID});
            return newAccount;
        }catch(err: any){
            console.error(`Error while creating account: ${err.message}`);
            throw err;
        }
    }
}