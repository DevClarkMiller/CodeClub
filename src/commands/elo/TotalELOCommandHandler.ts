import { Account } from "@generated/prisma";
import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler";
import AccountEloDao from "@dao/accountEloDao";

const SHOW_ELO_ERR_DEFAULT = "Couldn't find ELO for user, please see /help for the command layout";

export default class TotalELOCommandHandler extends SlashCommandHandler{
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

                account = await accDao.getByUsername(user);
                if (!account) return SHOW_ELO_ERR_DEFAULT;
            }else{
                account = await accDao.getByUsername(this.account.username);
            
                // Add account to the database
                if (!account) {
                    account = await accDao.add({DiscordUsername: this.account.username}, this.member);
                }
            }

            const accEloDao: AccountEloDao = new AccountEloDao();
            const totalElo: number = await accEloDao.totalEloForAccount(account);

            return `Total ELO for ${this.account.displayName} *${totalElo}`;
        }catch(err: any){
            console.error(err);
            return "";
        }
    }
}