import SlashCommandHandler from "../SlashCommandHandler";
import { User, GuildMember } from "discord.js";
import Role from "@lib/Role";
import { Codeforces } from "@lib/codeforces";
import axios from "axios";
import { Account } from "@generated/prisma";
import parseStandings, {ContestSite} from "@lib/parseStandings";
import updateElo from "@lib/updateElo";
import AccountDao from "@dao/accountDao";
import { calculateLeaderboardElo } from "@lib/calcElo";

export class SyncGymEloCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.Organizer);
    }

    public async handle(): Promise<any> {
        if (this.args.length === 0) return Promise.resolve("Please provide the html file to sync");

        try{
            const client: Codeforces.Client = new Codeforces.Client();

            const response = await axios.get(this.args[0]);
            const html: string = response.data;
            let standings: Codeforces.Standings;
            standings = await client.gymStandings(html);
            let parsedStandings: Account[][] | null = await parseStandings(standings, ContestSite.Codeforces);

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
            console.error(err);
            return "Something went wrong, please ensure the html file is valid";
        }
    }
}