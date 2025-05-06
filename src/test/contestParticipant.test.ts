import ContestDao from "@dao/contestDao";
import ContestParticipantDao from "@dao/contestParticipantDao";
import AccountDao from "@dao/accountDao";
import { Account, Contest } from "@generated/prisma";
import TEST_USERNAMES from "./testAccounts";

describe('can add contest participants', () => {
    const conDao: ContestDao = new ContestDao();
    const conParDao: ContestParticipantDao = new ContestParticipantDao();

    let accDao: AccountDao = new AccountDao();
    let accounts: Account[][] = [];
    let contest: Contest | null;


    beforeAll(async () =>{
        for(const username of TEST_USERNAMES){
            const account: Account | null = await accDao.getByUsername(username);
            if (!account) continue;
            accounts.push([account]);
        }

        contest = await conDao.getOne({Name: "TEST_COMPETITION"});
    });

    test("can successfully add contest participants", async () =>{
        await expect(async () =>{
            conParDao.addStandings(contest?.ID as number, accounts);
        }).not.toThrow();
    });
});