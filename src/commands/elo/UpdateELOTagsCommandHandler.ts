import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler"

export default class UpdateELOTagsCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            const accDao: AccountDao = new AccountDao();
            if (!this.member?.guild) return "Something went wrong";
            await accDao.updateGuildElo(this.member?.guild);
            return "Successfully updated all elo tags"
        }catch(err: any){
            console.error(err);
            return "";
        }
    }
}