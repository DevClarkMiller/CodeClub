import SlashCommandHandler from "../SlashCommandHandler";

// This will be tough, will have to use puppeteer and manually click through fields to get it, or use selenium.
export class StatsGymCommandHandler extends SlashCommandHandler{
    handle(): Promise<any> {
        return Promise.resolve("Gym stats");
    }
}