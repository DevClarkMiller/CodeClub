import { Account } from "@generated/prisma";
import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler";
import AccountEloDao from "@dao/accountEloDao";
import { Guild, GuildMember, SlashCommandBuilder } from "discord.js";
import findMember from "@lib/findMember";

const SHOW_ELO_ERR_DEFAULT = "Couldn't find ELO for user, please see /help for the command layout";

export default class TotalELOCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            const accDao: AccountDao = new AccountDao();
            let account: Account | null;
            let displayName: string;

            if (this.args.length !== 0){
                let userID: string = "";

                let i: number = this.args.findIndex(arg => arg === "--userid");
                if (i == -1) return SHOW_ELO_ERR_DEFAULT;
                i++; // Now points to the actual username
                userID = this.args[i];
                if (i === this.args.length) return SHOW_ELO_ERR_DEFAULT;

                account = await accDao.getByUsername(userID);
                if (!account) return SHOW_ELO_ERR_DEFAULT;
                const guildMember: GuildMember = await findMember(userID, this.member?.guild as Guild) as GuildMember;
                    displayName = guildMember.user.username;
            }else{
                account = await accDao.getByUsername(this.account.id);
            
                // Add account to the database
                if (!account) {
                    account = await accDao.add({DiscordUsername: this.account.id}, this.member);
                }

                displayName = this.member?.user.username as string;
            }

            const accEloDao: AccountEloDao = new AccountEloDao();
            const totalElo: number = await accEloDao.totalEloForAccount(account);
            

            return `Total ELO for '${displayName}' - ${totalElo}`;
        }catch(err: any){
            console.error(err);
            return "";
        }
    }

    public getDescription(): string{
        return "Returns the amount of elo the given user has";
    }

    public getName(): string{
       return "elo"; 
    }
}

export const cmdDefs: any[] = [
    new SlashCommandBuilder()
    .setName("elo")
    .setDescription("Returns the amount of elo the given user has")
    .addStringOption(option => 
        option.setName("userid")
        .setDescription("The userid to check elo on").
        setRequired(false)
    )
];