import { Guild, GuildMember } from "discord.js";

export default async function findMember(memberID: string, guild: Guild): Promise<GuildMember | null>{
    return await guild.members.fetch(memberID);
}