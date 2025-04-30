import PrismaSingleton from "../lib/prismaSingleton";
import SlashCommandHandler from "./SlashCommandHandler";

export default class ToggleShowELOCommandHandler extends SlashCommandHandler{
    async handle(): Promise<any> {
        try{
            let account = await PrismaSingleton.instance.account.findFirst({
                where: {DiscordUsername: this.account.username},
            });
            
            // Add account to the database
            if (!account) {
                account = await PrismaSingleton.instance.account.create({data: { DiscordUsername: this.account.username }});
            }

            await PrismaSingleton.instance.account.update({data: {
                ShowPoints: !account?.ShowPoints
            },where: {ID: account.ID}});

            return "Successfully toggled ELO label for account";
        }catch(err: any){
            console.error(err);
            return "";
        }
    }
}