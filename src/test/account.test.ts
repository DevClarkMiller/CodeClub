import { Account } from "@generated/prisma";
import AccountDao from "@dao/accountDao";
import TEST_USERNAMES from "./testAccounts";

test('can create account', async () =>{
    try{
        const accDao: AccountDao = new AccountDao();
        let account: Account | null;
        for(const testUsername of TEST_USERNAMES){
            account = await accDao.getByUsername(testUsername);
            if (!account) continue;

            accDao.delete(account.ID); // Account shouldn't exist at all
        }
        
        let seenIDS: Set<number> = new Set<number>();
        for(const testUsername of TEST_USERNAMES){
            account = await accDao.add({DiscordUsername: testUsername});
            if (!account) continue;
            seenIDS.add(account.ID);
        }
        
        expect(seenIDS.size).toBe(TEST_USERNAMES.length);
    }catch(err: any){
        console.error(err);
    }
});