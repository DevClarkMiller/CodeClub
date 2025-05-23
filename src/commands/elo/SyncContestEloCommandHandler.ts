import { Account } from "@generated/prisma";
import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler";
import { GuildMember, SlashCommandBuilder, User } from "discord.js";
import { Codeforces } from "@lib/codeforces";
import parseStandings, { ContestSite, toContestSite } from "@lib/parseStandings";
import { calculateLeaderboardElo } from "@lib/calcElo";
import updateElo from "@lib/updateElo";
import Role from "@lib/Role";

const ERR_DEFAULT = "Couldn't sync contest elo, please see /help for the command layout";


export default class SyncContestEloCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.ORGANIZER);
    }

    public async handle(): Promise<any> {
        try{
            // const { site, code } = this.getSiteAndCode(); 
            let parsedArgs = this.parseArgs();
            const site: string | undefined = parsedArgs.get("site");
            let code: string | undefined | number = parsedArgs.get("code");
            if (!site || !code) throw new Error("Missing some args");
            code = parseInt(code);

            const client: Codeforces.Client = new Codeforces.Client();
            let standings: Codeforces.Standings | null = await client.standings(code);
            if (!standings) return ERR_DEFAULT;

            let siteVal: ContestSite = toContestSite(site);
            let parsedStandings: Account[][] | null = await parseStandings(standings, siteVal);
            if (!parsedStandings) return "No members of the server were found in this contest";
            let eloDiffs: Map<number, number> | undefined = await calculateLeaderboardElo(parsedStandings);

            // Now update the elo for each account
            if (!eloDiffs) return "Something went wrong with the calculations, please try again";
            await updateElo(standings.contest.id.toString(), "codeforces", eloDiffs);

            const accDao: AccountDao = new AccountDao();
            if (this.member?.guild)
                await accDao.updateGuildElo(this.member?.guild);

            return `Successfully updated elos for ${eloDiffs.size} members`;
        }catch(err: any){
            console.error(err.message);
            return ERR_DEFAULT;
        }
    }

    public getDescription(): string{
        return "Syncs the contest to the database and updates the elo for each participant";
    }

    public getName(): string{
       return "synccontestelo"; 
    }
}

export const cmdDefs: any[] = [
    new SlashCommandBuilder()
    .setName("synccontestelo")
    .setDescription("Syncs the contest to the database and updates the elo for each participant")
    .addStringOption(option =>
        option.setName("sitename")
        .setDescription("The same of the site to sync the elo of")
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName("code")
        .setDescription("The id or code of the contest")
        .setRequired(true)
    )
];