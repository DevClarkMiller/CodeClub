import AccountDao from "@dao/accountDao";
import AccountEloDao from "@dao/accountEloDao";
import ContestDao from "@dao/contestDao";
import ContestParticipantDao from "@dao/contestParticipantDao";
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
        const conParDao: ContestParticipantDao = new ContestParticipantDao();

        // Will throw if a contest with the given name/id and site exists in the database already
        const newContest: Contest | null = await contestDao.add({Name: contestName, Site: constestSite});
        
        // Now add each participant to the newContest
        await conParDao.addStandings(newContest.ID, Array.from(newElos.keys())); // Feed the keys of the newElos map which are account ids

        for(const [accountId, newElo] of newElos){
            const account: Account = await accDao.getById(accountId);
            await accEloDao.add({Total: newElo, AccountID: account.ID});
        }
    }catch(err: any){
        console.error(err);
        throw err;
    }
}