import { Codeforces } from "@lib/codeforces";
import parseStandings, { ContestSite } from "@lib/parseStandings";
import { Account } from "@generated/prisma";
import * as fs from "fs/promises";


// describe('first', () => { 

//     test("can fetch standings", async () =>{
//         const client: Codeforces.Client = new Codeforces.Client();
//         let standings: Codeforces.Standings | null = await client.standings(2031);
    
//         if (standings){
//             console.log(standings.contest.id, standings.contest.name);
//         }
    
//         expect(standings).toBeTruthy;
//     });
//  })


// describe("can parse standing to accounts", () =>{
//     const client: Codeforces.Client = new Codeforces.Client();
//     let standings: Codeforces.Standings | null;
//     let parsedStandings: Account[][] | null;

//     beforeAll(async () =>{
//         standings = await client.standings(2031);
//     });

//     test("standings aren't null", async () => {
//         expect(standings).toBeTruthy();
//     });

//     test("can parse standings", async () =>{
//         parsedStandings = await parseStandings(standings, ContestSite.Codeforces);
//         console.log(parsedStandings);
//         expect(parsedStandings).toBeTruthy();
//     }, 300000);
// });


describe('can fetch gym standings', () => { 
    const client: Codeforces.Client = new Codeforces.Client();
    let standings: Codeforces.Standings;
    let testHtml: string;
    let parsedStandings: Account[][] | null = [];
    
    beforeAll(async () =>{
        testHtml = await fs.readFile("C:\\Users\\squas\\Downloads\\gymHtml.html", { encoding: 'utf8' });
        standings = await client.gymStandings(testHtml);
    });

    test("can scrape gym html without exception", async () =>{
        await expect(async () =>{
            standings = await client.gymStandings(testHtml);
        }).not.toThrow();
    });

    test("can parse without exception", async () =>{
        
        await expect(async () =>{
            parsedStandings = await parseStandings(standings, ContestSite.Codeforces);
            console.log(parsedStandings);
        }).not.toThrow();
    });
});