import { Account } from "@generated/prisma";
import PrismaSingleton from "../lib/prismaSingleton";
import AccountDao from "./dao/accountDao";
import SlashCommandHandler from "./SlashCommandHandler";

export default class ToggleShowELOCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            const accDao: AccountDao = new AccountDao();
            let account: Account | null = await accDao.getByUsername(this.account.username);
            
            // Add account to the database
            if (!account) {
                account = await accDao.add({DiscordUsername: this.account.username});
            }

            await accDao.update({ShowElo: !account.ShowElo}, {ID: account.ID});

            return "Successfully toggled ELO label for account";
        }catch(err: any){
            console.error(err);
            return "";
        }
    }
}