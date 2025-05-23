import { Account } from "@generated/prisma";
import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler";
import { SlashCommandBuilder } from "discord.js";

export default class ToggleShowELOCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            const accDao: AccountDao = new AccountDao();
            let account: Account | null = await accDao.getByUsername(this.account.username);
            
            // Add account to the database
            if (!account) {
                account = await accDao.add({DiscordUsername: this.account.id}, this.member);
            }

            await accDao.toggleShowElo(account, this.member);

            return "Successfully toggled ELO label for account";
        }catch(err: any){
            console.error(err);
            return "";
        }
    }

    public getDescription(): string{
        return "Will toggle if your nickname has your ELO included";
    }

    public getName(): string{
       return "toggleshowelo"; 
    }
}

export const cmdDefs: any[] = [
    new SlashCommandBuilder()
    .setName("toggleshowelo")
    .setDescription("Will toggle if your nickname has your ELO included")
];