import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = 'https://codeforces.com/api';

export namespace Codeforces{
    export type Member = {
        handle: string;
    }

    export type Party = {
        contestId?: number;
        participantId?: number;
        members: Member[];
        participateType?: string;
        ghost?: boolean;
        room?: number;
        startTimeSeconds?: number;
    }

    export type ProblemResult = {
        points: number;
        rejectedAttemptCount: number;
        type: string;
        bestSubmissionTimeSeconds: number;
    }

    export type Row = {
        party: Party;
        rank?: number;
        points?: number;
        penalty: number;
        successfulHackCount?: number;
        unsuccessfulHackCount?: number;
        problemResults?: ProblemResult[];
    }

    export type Problem = {
        contestId: number;
        index: string;
        name: string;
        type: string;
        points: number;
        rating: number;
        tags: string[];
    }

    export type Contest = {
        id: number;
        name: string;
        type: string;
        phase: string;
        frozen: boolean;
        durationSeconds: number;
        startTimeSeconds: number;
        relativeTimeSeconds: number;
    }
    
    export type Standings = {
        status?: string;
        contest?: Contest;
        problems?: Problem[];
        rows: Row[];
    }

    export class Client{
        public async standings(contestId: number): Promise<Standings | null>{
            try{
                let url: string = `${BASE_URL}/contest.standings`;
                const urlObj: URL = new URL(url);
                urlObj.searchParams.append("contestId", contestId.toString());
                urlObj.searchParams.append("from", "1");
                urlObj.searchParams.append("count", "10000");
            
                const response = await axios.get(urlObj.toString());
                return response.data.result;
            }catch(err: any){
                console.error(err);
                return null;
            }
        }

        private getContestantUsername(element: cheerio.Cheerio<any>): string | null{
            const aElem = element.find("a");
            if (aElem.length === 0) return null;
            return aElem.html()?.trim() as string;
        }

        public async gymStandings(gymHtml: string): Promise<Standings>{
            const $: cheerio.CheerioAPI = cheerio.load(gymHtml);
            let standings: Standings = {rows: []};

            $(".standings tr").each((_, element) =>{ 
                // console.log($(this).prop('outerHTML'));
                const contestantCell = $(element).find(".contestant-cell");
                if (contestantCell.length === 0) return;

                const username: string | null = this.getContestantUsername(contestantCell);
                if (!username) return;

                const penalty: number = parseInt($(element).find("td:nth-child(4)").html()?.trim() as string);
                if (!penalty) return;
                
                const row: Row = {penalty: penalty, party: {members: [{handle: username}]}};
                standings.rows.push(row);
            });
            
            return Promise.resolve(standings);
        }
    }
}