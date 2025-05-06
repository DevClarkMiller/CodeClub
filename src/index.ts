import { Client, GatewayIntentBits, messageLink } from "discord.js";
import { config } from "./config";
import CommandHandler from "./commands/CommandHandler";
import { RoleError } from "./lib/Role";
import { commandFactory} from "./commands";

function isClubBot(displayName: string): boolean{
  return displayName == "CodeClub";
}

// DEFAULT ELO WILL BE 1000. TODO: DEVELOP ALGORITHM FOR PULLING CODEFORCES, KATTIS SCORE IN

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.DirectMessages, 
    GatewayIntentBits.MessageContent
  ],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

client.on('guildMemberAdd', async member =>{
  const commandHandler: CommandHandler = commandFactory(member.user, member, "addAccount", null);
  return commandHandler.handle();
});

client.on('messageCreate', async msg =>{
  try{
    if (isClubBot(msg.author.displayName)) return;
    // console.log(`${msg.author.displayName}: ${msg.content}`);

    if (msg.content[0] === '/'){
      let args: string[] = msg.content.split(" ");
      let cmd: string = args.shift() as string;
      cmd = cmd.substring(1, cmd.length);

      // If there are any attachments, add them as an arg
      for (const [_, attatchment] of msg.attachments){
        args.push(attatchment.url);
      }

      const commandHandler: CommandHandler = commandFactory(msg.author, msg.member, cmd, args);
      const res: any | undefined | null = await commandHandler.handle();
      if (res) await msg.channel.send(res);
    }
  }catch(err: any){
    if (err instanceof RoleError)
      await msg.channel.send(err.message);
    else
      console.error(err.message);
  }
});

client.login(config.DISCORD_TOKEN);