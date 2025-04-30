import SlashCommandHandler from "@commands/SlashCommandHandler";
import PrismaSingleton from "@lib/prismaSingleton";

// THIS WILL ALSO ADD AN INITIAL 1000 ELO
export default class AddAccountCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            await PrismaSingleton.instance.account.create({data: { DiscordUsername: this.account.username }});
            return `Successfully added ${this.account.displayName} added user to database`;
        }catch(err: any){
            // console.error(err);
            return `Something went wrong while adding ${this.account.displayName} to database`;
        }
    }
}