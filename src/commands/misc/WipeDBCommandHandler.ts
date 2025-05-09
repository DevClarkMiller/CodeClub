import SlashCommandHandler from "@commands/SlashCommandHandler";
import { User, GuildMember } from "discord.js";
import Role from "@lib/Role";
import AccountDao from "@dao/accountDao";
import AccountEloDao from "@dao/accountEloDao";
import ContestDao from "@dao/contestDao";
import ContestParticipantDao from "@dao/contestParticipantDao";

// Builds the result of the help command
export default class WipeDBCommandHandler extends SlashCommandHandler{
    public constructor(account: User, member: GuildMember | null, args: any){
        super(account, member, args, Role.ADMIN);
    }

    async handle(): Promise<any> {
        try{
            const accDao = new AccountDao();
            const accEloDao = new AccountEloDao();
            const conDao = new ContestDao();
            const conParDao = new ContestParticipantDao();

            await accDao.deleteMany(null);
            await accEloDao.deleteMany(null);
            await conDao.deleteMany(null);
            await conParDao.deleteMany(null);

        }catch(err: any){
            return "Something went wrong while wiping the database";
        }
    }
}