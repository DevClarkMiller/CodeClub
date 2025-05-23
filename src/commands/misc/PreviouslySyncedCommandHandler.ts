import SlashCommandHandler from "@commands/SlashCommandHandler";
import Role, { getRoleName, getRoleValue, roleCommands } from "@lib/Role";
import ContestDao from "@dao/contestDao";
import { Contest } from "@generated/prisma";
import { SlashCommandBuilder } from "discord.js";

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

    public getDescription(): string{
        return "Lists all the previously synced competitions";
    }

    public getName(): string{
       return "previouslysynced"; 
    }
}

export const cmdDefs: any[] = [
    new SlashCommandBuilder()
    .setName("previouslysynced")
    .setDescription("Lists all the previously synced competitions")
];
