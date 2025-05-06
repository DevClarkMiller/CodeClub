import { GuildMember, User } from "discord.js";

import SlashCommandHandler from "@commands/SlashCommandHandler";
import PrismaSingleton from "@lib/prismaSingleton";
import Role from "@lib/Role";
import AccountDao from "@dao/accountDao";
import { Account } from "@generated/prisma";

const ERR_DEFAULT = "Couldn't update username for site, please see /help for the command layout";


export default class SetSiteUsernameCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.Organizer);
    }

    getUserAndSite(): {user: string, site: string} | null{
        let site: string = "";
        let user: string = "";

        let i = 0;
        while (i < this.args.length){
            if (this.args[i].toLowerCase() === "--user"){
                i++;
                user = this.args[i];
            }else if(this.args[i].toLowerCase() === '--site'){
                i++;
                site = this.args[i];
            }
            i++;
        }

        if (!user || !site) return null; 
        return { user, site };
    }

    async handle(): Promise<any> {
        try{
            const accDao: AccountDao = new AccountDao();
            const userAndSite = this.getUserAndSite();
            if (!userAndSite) return ERR_DEFAULT;
            let { user, site } = userAndSite;
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
}