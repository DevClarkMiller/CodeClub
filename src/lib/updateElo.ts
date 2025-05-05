import AccountDao from "@dao/accountDao";
import AccountEloDao from "@dao/accountEloDao";
import { Account } from "@generated/prisma";

/**
 * 
 * @param newElos Key is the id of the accounts, the value is the elo diff
 */
export default async function updateElo(newElos: Map<number, number>): Promise<void>{
    try{
        const accDao: AccountDao = new AccountDao();
        const accEloDao: AccountEloDao = new AccountEloDao();
        for(const [accountId, newElo] of newElos){
            const account: Account = await accDao.getById(accountId);
            await accEloDao.add({Total: newElo, AccountID: account.ID});

        }
    }catch(err: any){
        console.error(err);
        throw err;
    }
}