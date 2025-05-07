enum Role{
    ADMIN = 1,
    USER = 2,
    // For testing
    TestRole = 3,
    Organizer = 4,
    UnknownRole = 10
}

export class RoleError extends Error{
    constructor(msg: string){
        super(msg);
    }
}

export function getRoleValue(role: string): Role{
    switch(role){
        case "Admin": return Role.ADMIN;
        case "User": return Role.USER;
        case "Organizer": return Role.Organizer;
        default: return Role.UnknownRole;
    }
}

export function getRoleName(role: Role): string{
    switch(role){
        case Role.USER: return "User";
        case Role.ADMIN: return "Admin";
        case Role.TestRole: return "TestRole";
        case Role.Organizer: return "Organizer";
        default: return "";   
    }
}

export function roleCommands(role: Role){
    let res: string[] = []; // Res is built onto from the role, this is done for clarity

    switch(role){
        case Role.ADMIN:
            res.push("## Admin");
            res.push("- /addRole --userID USERID --role ROLE $ Assigns the given user the specified role");
            res.push("- /removeRole --userID USERID --role ROLE $ Removes role from the given user");
            res.push("- /addAllAccounts $ Adds every account in the server to the database");
            res.push("- /allAccounts $ Lists off every account with their elo that's in the database");
            res.push("- /giveAllUserRole $ Gives everyone in the server the user role");
            res.push("- /wipeDB $ Wipes all the data from the database");
            res.push("- /resetAllElo $ Resets the elo of everyone on the server back to 1000");
            break;
        case Role.Organizer: 
            res.push("## Organizer");
            res.push('- /syncContestElo --site SITE_NAME --code CONTEST_CODE $ Syncs the contest to the database and updates the elo for each participant');
            res.push('- /syncGymElo $ Requires you to upload the html of the gym standings as an attachment')
            res.push("- /updateEloTags $ Updates the elo tag in each users nickname");
            res.push("- /previouslySynced $ Lists all the previously synced competitions");
            break;
        case Role.USER: 
            res.push("## User");
            res.push("- /help $ Returns a list of commands");
            res.push("- /elo --userID USERID $ Returns the amount of elo the given user has");
            res.push("- /eloHistory $ Returns your complete elo history");
            res.push("- /toggleShowELO $ Will toggle if your nickname has your ELO included");
            res.push("- /addAccount $ Will add your account to the database");
            res.push("- /setSiteUsername --user SITES_USERNAME --site ['kattis', 'codeforces'] $ Sets your username for the specified site, important for updating elo after a competition");
            break;
    }

    return res.join("\n");
}

export default Role;