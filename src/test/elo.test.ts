import { calculateLeaderboardElo } from "@lib/calcElo";
import AccountDao from "@dao/accountDao";
import TEST_USERNAMES from "./testAccounts";
import { Account } from "@generated/prisma";

// This test is for if not a single person tied in the competition, like you potentially can on Kattis
test('calcElo', async () => {
    const accDao: AccountDao = new AccountDao();

    let accounts: Account[][] = [];
    for(const username of TEST_USERNAMES){
        const account: Account | null = await accDao.getByUsername(username);
        if (!account) continue;
        accounts.push([account]);
    }

    let newElos: Map<string, number> | undefined;
    expect(async () =>{
        await calculateLeaderboardElo(accounts);
    }).not.toThrow();

    newElos = await calculateLeaderboardElo(accounts);
    console.log(newElos);
    expect(newElos).toBeDefined();
});