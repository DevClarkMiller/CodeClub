import { Codeforces } from "@lib/codeforces";
import parseStandings, { ContestSite } from "@lib/parseStandings";
import { Account } from "@generated/prisma";

test("can fetch standings", async () =>{
    const client: Codeforces.Client = new Codeforces.Client();
    let standings: Codeforces.Standings | null = await client.standings(2031);

    if (standings){
        console.log(standings.contest.id, standings.contest.name);
    }

    expect(standings).toBeTruthy;
});


describe("can parse standing to accounts", () =>{
    const client: Codeforces.Client = new Codeforces.Client();
    let standings: Codeforces.Standings | null;
    let parsedStandings: Account[][] | null;

    beforeAll(async () =>{
        standings = await client.standings(2031);
    });

    test("standings aren't null", async () => {
        expect(standings).toBeTruthy();
    });

    test("can parse standings", async () =>{
        parsedStandings = await parseStandings(standings, ContestSite.Codeforces);
        console.log(parsedStandings);
        expect(parsedStandings).toBeTruthy();
    }, 300000);

    // test("can log standings", () =>{
    //     console.log(standings);
    // });
});