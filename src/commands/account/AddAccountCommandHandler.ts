import AccountDao from "@dao/accountDao";
import SlashCommandHandler from "@commands/SlashCommandHandler";

// THIS WILL ALSO ADD AN INITIAL 1000 ELO
export default class AddAccountCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            // await PrismaSingleton.instance.account.create({data: { DiscordUsername: this.account.username }});
            const accDao: AccountDao = new AccountDao();
            await accDao.add({DiscordUsername: this.account.id}, this.member);
            return `Successfully added ${this.account.displayName} added user to database`;
        }catch(err: any){
            return `Something went wrong while adding ${this.account.displayName} to database`;
        }
    }

    public getDescription(): string{
        return "Will add your account to the database";
    }

    public getName(): string{
       return "addaccount"; 
    }
}