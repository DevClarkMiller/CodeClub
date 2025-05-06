import { GuildMember, User, Collection, Snowflake} from "discord.js";

import SlashCommandHandler from "@commands/SlashCommandHandler";
import Role from "@lib/Role";
import AccountDao from "@dao/accountDao";
import { Account } from "@generated/prisma";

export default class AddAllAccountsCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.Organizer);
    }

    async handle(): Promise<any> {
        let addedCnt: number = 0;
        if (!this.member?.guild) return "Unknown issue while adding all accounts";

        const allMembers: Collection<Snowflake, GuildMember> = await this.member.guild.members.fetch({withPresences: true});

        const accDao: AccountDao = new AccountDao();
        for (const member of allMembers.values()){
            try{
                let existingAccount: Account | null = await accDao.getByUsername(member.user.id);
                if (existingAccount !== null) continue;
                

                await accDao.add({DiscordUsername: member.user.id}, this.member);

                addedCnt++;
            }catch(err){
                console.error(err);
            }
        }

        if (addedCnt === 0)
            return Promise.resolve("All users are already in the database");
        return Promise.resolve(`Successfully added ${addedCnt} accounts to the database.`);
    }
}