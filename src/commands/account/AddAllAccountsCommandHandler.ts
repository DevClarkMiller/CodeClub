import { GuildMember, User } from "discord.js";

import SlashCommandHandler from "@commands/SlashCommandHandler";
import PrismaSingleton from "@lib/prismaSingleton";
import Role from "@lib/Role";

export default class AddAllAccountsCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.Organizer);
    }

    async handle(): Promise<any> {
        let addedCnt: number = 0;
        if (!this.member?.guild.members.cache) return "Unknown issue while adding all accounts";

        for (const member of this.member?.guild.members.cache.values()){
            try{
                const existingAccount = await PrismaSingleton.instance.account.findUnique({
                    where: {
                        DiscordUsername: member.user.username
                    }
                });

                if (existingAccount !== null) continue;
                
                await PrismaSingleton.instance.account.create({
                    data: {
                        DiscordUsername: member.user.username,
                    }
                });

                addedCnt++;
            }catch(err){
                // console.error(err);
            }
        }

        if (addedCnt === 0)
            return Promise.resolve("All users are already in the database");
        return Promise.resolve(`Successfully added ${addedCnt} accounts to the database.`);
    }
}