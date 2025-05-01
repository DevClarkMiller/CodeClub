import { Account } from "@generated/prisma";
import PrismaSingleton from "@lib/prismaSingleton";
import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler";
import AccountEloDao from "@dao/accountEloDao";
import { Guild } from "discord.js";

const SHOW_ELO_ERR_DEFAULT = "Couldn't find ELO for user, please see /help for the command layout";

export default class ShowELOCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            const accDao: AccountDao = new AccountDao();
            let account: Account | null;

            if (this.args.length !== 0){
                let user: string = "";

                let i: number = this.args.findIndex(arg => arg === "--user");
                if (i == -1) return SHOW_ELO_ERR_DEFAULT;
                i++; // Now points to the actual username
                user = this.args[i];
                if (i === this.args.length) return SHOW_ELO_ERR_DEFAULT;

                account = await accDao.getByDisplayName(user, this.member?.guild as Guild);
                if (!account) return SHOW_ELO_ERR_DEFAULT;
            }else{
                account = await accDao.getByUsername(this.account.username);
            
                // Add account to the database
                if (!account) {
                    account = await accDao.add({DiscordUsername: this.account.username});
                }
            }

            const accEloDao: AccountEloDao = new AccountEloDao();
            const totalElo: number = await accEloDao.totalPointsForAccount(account);

            return `Total ELO for ${this.account.displayName} *${totalElo}`;
        }catch(err: any){
            console.error(err);
            return "";
        }
    }
}