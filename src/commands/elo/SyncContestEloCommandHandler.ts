import { Account } from "@generated/prisma";
import PrismaSingleton from "@lib/prismaSingleton";
import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler";
import AccountEloDao from "@dao/accountEloDao";
import { Guild } from "discord.js";
import { Codeforces } from "@lib/codeforces";
import parseStandings, { ContestSite, toContestSite } from "@lib/parseStandings";
import { calculateLeaderboardElo } from "@lib/calcElo";
import updateElo from "@lib/updateElo";

const ERR_DEFAULT = "Couldn't sync contest elo, please see /help for the command layout";


export default class SyncContestEloCommandHandler extends SlashCommandHandler{
    private getSiteAndCode(): {site: string, code: number}{
        let site: string = "";
        let code: number = 0;

        let i = 0;
        while (i < this.args.length){
            if (this.args[i].toLowerCase() === "--site"){
                i++;
                site = this.args[i];
            }else if(this.args[i].toLowerCase() === '--code'){
                i++;
                code = parseInt(this.args[i]);
            }
            i++;
        }

        if (!site || !code) throw new Error("Missing some args");
        return { site, code };
    }

    public async handle(): Promise<any> {
        try{
            const { site, code } = this.getSiteAndCode(); 
            const client: Codeforces.Client = new Codeforces.Client();
            let standings: Codeforces.Standings | null = await client.standings(code);
            if (!standings) return ERR_DEFAULT;

            let siteVal: ContestSite = toContestSite(site);
            let parsedStandings: Account[][] | null = await parseStandings(standings, siteVal);
            if (!parsedStandings) return "No members of the server were found in this contest";
            let eloDiffs: Map<number, number> | undefined = await calculateLeaderboardElo(parsedStandings);

            // Now update the elo for each account
            if (!eloDiffs) return "Something went wrong with the calculations, please try again";
            await updateElo(eloDiffs);

            const accDao: AccountDao = new AccountDao();
            if (this.member?.guild)
                await accDao.updateGuildElo(this.member?.guild);
            

            return `Successfully updated elos for ${eloDiffs.size} members`;
        }catch(err: any){
            console.error(err.message);
            return ERR_DEFAULT;
        }
    }
}