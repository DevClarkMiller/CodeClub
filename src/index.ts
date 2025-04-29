import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { commandFactory, CommandHandler, RoleError} from "./commands";

function isClubBot(displayName: string): boolean{
  return displayName == "CodeClub";
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

client.on('messageCreate', async msg =>{
  try{
    if (isClubBot(msg.author.displayName)) return;
    console.log(`${msg.author.displayName}: ${msg.content}`);

    if (msg.content[0] === '/'){
      let args: string[] = msg.content.split(" ");
      let cmd: string = args.shift() as string;
      cmd = cmd.substring(1, cmd.length);
      const commandHandler: CommandHandler = commandFactory(msg.author, msg.member, cmd, args);
      const res: any | undefined | null = await commandHandler.handle();
      if (res) await msg.channel.send(res);
    }
  }catch(err: any){
    if (err instanceof RoleError)
      await msg.channel.send(err.message);
  }
});

client.login(config.DISCORD_TOKEN);