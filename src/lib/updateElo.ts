import AccountDao from "@dao/accountDao";
import AccountEloDao from "@dao/accountEloDao";
import ContestDao from "@dao/contestDao";
import { Account, Contest } from "@generated/prisma";

/**
 * 
 * @param newElos Key is the id of the accounts, the value is the elo diff
 */
export default async function updateElo(contestName: string, constestSite: string, newElos: Map<number, number>): Promise<void>{
    try{
        const accDao: AccountDao = new AccountDao();
        const accEloDao: AccountEloDao = new AccountEloDao();
        const contestDao: ContestDao = new ContestDao();

        // Will throw if a contest with the given name/id and site exists in the database already
        const newContest: Contest | null = await contestDao.add({Name: contestName, Site: constestSite});

        for(const [accountId, newElo] of newElos){
            const account: Account = await accDao.getById(accountId);
            await accEloDao.add({Total: newElo, AccountID: account.ID});
        }
    }catch(err: any){
        console.error(err);
        throw err;
    }
}