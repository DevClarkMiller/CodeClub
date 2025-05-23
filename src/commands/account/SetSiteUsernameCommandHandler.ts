import { GuildMember, User } from "discord.js";

import SlashCommandHandler from "@commands/SlashCommandHandler";
import PrismaSingleton from "@lib/prismaSingleton";
import Role from "@lib/Role";
import AccountDao from "@dao/accountDao";
import { Account } from "@generated/prisma";

const ERR_DEFAULT = "Couldn't update username for site, please see /help for the command layout";


export default class SetSiteUsernameCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            const accDao: AccountDao = new AccountDao();
            const parsedArgs = this.parseArgs();
            const user: string | undefined = parsedArgs.get('user');
            let site: string | undefined = parsedArgs.get('site');
            if (!user || !site) return ERR_DEFAULT;

            let account: Account | null = await accDao.getByUsername(this.account.id);
            if (!account) return "Please do /addAccount before proceeding.";
            site = site.toLowerCase();
            if (!(["kattis", "codeforces"].find(s => s === site))) return "Site unknown, options are 'kattis' or 'codeforces'";
            switch(site){
                case "kattis":
                    account.KattisUsername = user;
                    break;
                case "codeforces":
                    account.CodeforcesUsername = user;
                    break;
            }

            await accDao.update({
                KattisUsername: account.KattisUsername, CodeforcesUsername: account.CodeforcesUsername
            }, {ID: account.ID});
            return "Successfully updated site username";
        }catch(err: any){
            console.error(err);
            return ERR_DEFAULT;
        }
    }

    public getDescription(): string{
        return "Sets your username for the specified site, important for updating elo after a competition";
    }

    public getName(): string{
       return "setsiteusername"; 
    }
}