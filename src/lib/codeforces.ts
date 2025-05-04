import axios from "axios";

const BASE_URL = 'https://codeforces.com/api';

export namespace Codeforces{
    export type Member = {
        handle: string;
    }

    export type Party = {
        contestId: number;
        participantId: number;
        members: Member[];
        participateType: string;
        ghost: boolean;
        room: number;
        startTimeSeconds: number;
    }

    export type ProblemResult = {
        points: number;
        rejectedAttemptCount: number;
        type: string;
        bestSubmissionTimeSeconds: number;
    }

    export type Row = {
        party: Party;
        rank: number;
        points: number;
        penalty: number;
        successfulHackCount: number;
        unsuccessfulHackCount: number;
        problemResults: ProblemResult[];
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
        status: string;
        contest: Contest;
        problems: Problem[];
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
    }
}