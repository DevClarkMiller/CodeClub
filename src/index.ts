import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { commandFactory, CommandHandler} from "./commands";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
});

client.on('messageCreate', msg =>{
  console.log(`${msg.author.displayName}: ${msg.content}`);
  if (msg.content[0] === '/'){
    let args: string[] = msg.content.split(" ");
    let cmd: string = args.shift() as string;
    cmd = cmd.substring(1, cmd.length);
    const commandHandler: CommandHandler = commandFactory(msg.author, msg.member, cmd, args);
    commandHandler.handle();
  }
});

client.login(config.DISCORD_TOKEN);