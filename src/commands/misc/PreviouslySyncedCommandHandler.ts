import SlashCommandHandler from "@commands/SlashCommandHandler";
import Role, { getRoleName, getRoleValue, roleCommands } from "@lib/Role";
import ContestDao from "@dao/contestDao";
import { Contest } from "@generated/prisma";

// Builds the result of the help command
export default class PreviouslySyncedCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            const contestDao: ContestDao = new ContestDao();
            const contests: Contest[] = await contestDao.getAll();
            let res: string[] = ["# Previous contests"];
            
            contests.forEach(contest =>{
                res.push(`- ${contest.Site === "codeforces" ? "ContestID: " : "Name: "} ${contest.Name}, Site: ${contest.Site}`);
            });

            if (res.length === 0) return "No contests found";
            
            return res.join('\n');
        }catch(err: any){
            return "Something went wrong while finding previous contests"
        }
    }
}