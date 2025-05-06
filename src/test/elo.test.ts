import { calculateLeaderboardElo } from "@lib/calcElo";
import AccountDao from "@dao/accountDao";
import TEST_USERNAMES from "./testAccounts";
import { Account } from "@generated/prisma";
import updateElo from "@lib/updateElo";

// This test is for if not a single person tied in the competition, like you potentially can on Kattis
test('calcElo', async () => {
    const accDao: AccountDao = new AccountDao();

    let accounts: Account[][] = [];
    for(const username of TEST_USERNAMES){
        const account: Account | null = await accDao.getByUsername(username);
        if (!account) continue;
        accounts.push([account]);
    }

    let newElos: Map<number, number> | undefined;
    expect(async () =>{
        await calculateLeaderboardElo(accounts);
    }).not.toThrow();

    newElos = await calculateLeaderboardElo(accounts);
    expect(newElos).toBeDefined();
});

describe("can calculate elo", () =>{
    let accDao: AccountDao = new AccountDao();
    let accounts: Account[][] = [];
    let eloDiffs: Map<number, number> | undefined;
    
    beforeAll(async () =>{
        for(const username of TEST_USERNAMES){
            const account: Account | null = await accDao.getByUsername(username);
            if (!account) continue;
            accounts.push([account]);
        }
    });

    test('can calculate elo diff', async () =>{
        eloDiffs = await calculateLeaderboardElo(accounts);  
        console.log(eloDiffs);
        expect(eloDiffs).toBeDefined();
    });

    test('can update each users elo ', async () =>{
        expect(async () =>{
            eloDiffs = await calculateLeaderboardElo(accounts);  
            if (!eloDiffs) return;
            await updateElo("TEST_COMPETITION", "codeforces", eloDiffs);
        }).not.toThrow();
    });
});