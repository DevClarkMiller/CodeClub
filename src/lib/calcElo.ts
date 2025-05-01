import { Account } from "../../generated/prisma";
import AccountEloDao from "@dao/accountEloDao";

// Gets the sum of elo for a group of accounts
async function groupAverage(group: Account[], accEloDao: AccountEloDao): Promise<number>{
    let sum = 0;
    for(const account of group){
        const elo: number = await accEloDao.totalEloForAccount(account);
        sum += elo;
    }

    return sum / group.length;
}

// Calculate and return the expected score
function probability(rating1: number, rating2: number){
    return 1.0 / (1 + Math.pow(10, (rating1 - rating2) / 400.0));
}

// outcome determines the outcome: 1 for Player A win, 0 for Player B win, 0.5 for draw.
function calculateEloDiff(eloA: number, eloB: number, K: number, outcome: number): number{
    // let Pb: number = probability(Ra, Rb);
    let Pa: number = probability(eloB, eloA);
    
    return Math.abs((eloA + K * (outcome - Pa)) - eloA);
    // eloA = eloA + K * (outcome - Pa);
    // // Rb = Rb + K * ((1 - outcome) - Pb);
    // return eloA;
}

/**
 * Brief: Uses prefix/suffix sum to get the average elo of all players higher than the player and deducts elo according to that
 *        then does the same for all players benath the player, but adds elo depending on that value.
 *        The players position in the array matters too, this is their actual ranking
 * @param accounts 2D array of Accounts for each group of accounts
 * @returns A map of players usernames to their new elo
 */
export async function calculateLeaderboardElo(accounts: Account[][], K: number = 30): Promise<Map<string, number> | undefined>{
    // TODO: GET THE PREFIX AND SUFFIX OF EACH GROUP AS WELL TO CALCULATE TIES!!!
    if (accounts.length === 0) return;

    const accEloDao: AccountEloDao = new AccountEloDao();

    // PREFIX
    let prefixSum: number[] = new Array(accounts.length).fill(0);
    prefixSum[0] = await groupAverage(accounts[0], accEloDao);
    for(let i = 1; i < accounts.length; i++){
        // Each index is a group of accounts, so add these to the sum
        const eloSum: number = await groupAverage(accounts[i], accEloDao);
        prefixSum[i] = (prefixSum[i - 1] + eloSum) / 2;
    }

    // SUFFIX
    const suffixSum: number[] = new Array(accounts.length).fill(0);
    suffixSum[suffixSum.length - 1] = await groupAverage(accounts[accounts.length - 1], accEloDao);
    for(let i = accounts.length - 2; i >= 0; i--){
        // Each index is a group of accounts, so add these to the sum
        const eloSum: number = await groupAverage(accounts[i], accEloDao);
        suffixSum[i] = (suffixSum[i + 1] + eloSum) / 2;
    }
    
    // FINALLY CALCULATE THE NEW ELO FOR EACH ACCOUNT NOT CONSIDERING TIES
    let res: Map<string, number> = new Map<string, number>();
    for (let i = 0; i < accounts.length; i++){
        for(const account of accounts[i]){
            const currElo: number = await accEloDao.totalEloForAccount(account);
            let newElo = currElo;

            if (i - 1 >= 0) // THIS IS THE LOSS
                newElo -= calculateEloDiff(newElo, prefixSum[i - 1], K, 0);

            if (i + 1 < suffixSum.length) // THIS IS THE GAIN
                newElo += calculateEloDiff(newElo, prefixSum[i + 1], K, 1);

            res.set(account.DiscordUsername, newElo);
        }
    }

    return res;
}