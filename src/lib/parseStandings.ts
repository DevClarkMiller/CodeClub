import AccountDao from "@dao/accountDao";
import { Codeforces } from "./codeforces";
import { Account } from "@generated/prisma";

export enum ContestSite {
    Kattis = 0,
    Codeforces = 1,
    Unknown = 10
}

export function toContestSite(contest: string){
    switch(contest.toLowerCase()){
        case "kattis": return ContestSite.Kattis;
        case "codeforces": return ContestSite.Codeforces;
        default: return ContestSite.Unknown;
    }
}

async function getAccounts(accDao: AccountDao, members: Codeforces.Member[]): Promise<Account[]>{
    let accounts: Account[] = [];
    
    try{
        for(const member of members){
            const account: Account | null = await accDao.getByCodeforcesUsername(member.handle);
            if (!account) continue;

            accounts.push(account);
        }

        return accounts;
    }catch(err: any){
        console.error(err);
        return [];   
    }
}


// Potentially update to do a search for any codeforce usernames which exist in the given competition
async function parseCodeforcesStandings(standings: Codeforces.Standings): Promise<Account[][] | null>{
    try{
        const accDao: AccountDao = new AccountDao();
        let res: {accounts: Account[], points: number}[] = [];

        const firstAccounts: Account[] = await getAccounts(accDao, standings.rows[0].party.members);
        if (firstAccounts.length > 0){
            res.push({accounts: firstAccounts, points: standings.rows[0].points});
        }

        for (let i = 1; i < standings.rows.length; i++){
            const row = standings.rows[i];
            const accounts: Account[] = await getAccounts(accDao, row.party.members);
            if (accounts.length === 0) continue;
            if (res.length === 0){
                res.push({accounts: accounts, points: row.points });
                continue;
            }
        
            if (res[res.length - 1].points === row.points)
                res[res.length - 1].accounts = [...res[res.length - 1].accounts, ...accounts]; // Merge the two groups since they have the same amount of points
            else
                res.push({accounts: accounts, points: row.points});
        }
        
        return res.map(item => item.accounts); // Finally return an array with only the accounts, not including the points
    }catch(err: any){
        console.error(err);
        return null;
    }
}

export default async function parseStandings(standings: any, contestSite: ContestSite): Promise<Account[][] | null>{
    switch(contestSite){
        case ContestSite.Codeforces: return await parseCodeforcesStandings(standings);
        default: return null;
    }
}   