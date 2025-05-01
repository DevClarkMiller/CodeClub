import Dao from "./dao";
import PrismaSingleton from "@lib/prismaSingleton";
import { Account } from "@generated/prisma";
import AccountEloDao from "./accountEloDao";

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

    public async toggleShowElo(account: Account): Promise<void>{
        try{
            await PrismaSingleton.instance.account.update({data: {
                ShowElo: !account?.ShowElo
            },where: {ID: account.ID}});
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