import { Account } from "../../generated/prisma";

/**
 * Brief: Uses prefix/postfix sum to get the average elo of all players higher than the player and deducts elo according to that
 *        then does the same for all players benath the player, but adds elo depending on that value.
 *        The players position in the array matters too, this is their actual ranking
 * @param players - 2D array of Accounts for each group of players
 */
export function calculateElo(players: Account[][]){
    
}