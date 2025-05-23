enum Role{
    ADMIN = 1,
    USER = 2,
    // For testing
    TestRole = 3,
    ORGANIZER = 4,
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
        case "Organizer": return Role.ORGANIZER;
        default: return Role.UnknownRole;
    }
}

export function getRoleName(role: Role): string{
    switch(role){
        case Role.USER: return "User";
        case Role.ADMIN: return "Admin";
        case Role.TestRole: return "TestRole";
        case Role.ORGANIZER: return "Organizer";
        default: return "";   
    }
}

export function roleCommands(role: Role){
    let res: string[] = []; // Res is built onto from the role, this is done for clarity

    switch(role){
        case Role.ADMIN:
            res.push("## Admin");
            res.push("- /addrole --userID USERID --role ROLE $ Assigns the given user the specified role");
            res.push("- /removerole --userID USERID --role ROLE $ Removes role from the given user");
            res.push("- /addallaccounts $ Adds every account in the server to the database");
            res.push("- /allaccounts $ Lists off every account with their elo that's in the database");
            res.push("- /wipedb $ Wipes all the data from the database");
            res.push("- /resetallelo $ Resets the elo of everyone on the server back to 1000");
            break;
        case Role.ORGANIZER: 
            res.push("## Organizer");
            res.push('- /synccontestelo --site SITE_NAME --code CONTEST_CODE $ Syncs the contest to the database and updates the elo for each participant');
            res.push('- /syncgymelo $ Requires you to upload the html of the gym standings as an attachment')
            res.push("- /updateelotags $ Updates the elo tag in each users nickname");
            res.push("- /previouslysynced $ Lists all the previously synced competitions");
            break;
        case Role.USER: 
            res.push("## User");
            res.push("- /help $ Returns a list of commands");
            res.push("- /elo --userID USERID $ Returns the amount of elo the given user has");
            res.push("- /elohistory $ Returns your complete elo history");
            res.push("- /toggleshowelo $ Will toggle if your nickname has your ELO included");
            res.push("- /addaccount $ Will add your account to the database");
            res.push("- /setsiteusername --user SITES_USERNAME --site ['kattis', 'codeforces'] $ Sets your username for the specified site, important for updating elo after a competition");
            break;
    }

    return res.join("\n");
}

export default Role;