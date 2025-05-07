import { Account, AccountElo } from "@generated/prisma";
import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler";
import AccountEloDao from "@dao/accountEloDao";

export default class EloHistoryCommandHandler extends SlashCommandHandler{
    public async handle(): Promise<any> {
        const accDao: AccountDao = new AccountDao();
        const accEloDao: AccountEloDao = new AccountEloDao();

        try{
            const account: Account = await accDao.getByUsername(this.account.id) as Account;
            const eloHist: AccountElo[] = await accEloDao.getSome({AccountID: account.ID});

            let res: string[] = ["# Elo history"];
            eloHist.forEach(hist =>{
                if (hist.Total) 
                    res.push(`- ${hist.CreatedOn}: ${hist.Total === 0 ? "" : hist.Total > 0 ? "+" : "-" }${hist.Total}`);
            });
            
            return res.join('\n');
        }catch(err: any){
            console.error(err);
            return "Couldn't get your elo history, please try again";
        }
    }
}