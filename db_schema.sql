USE MASTER 
GO

-- This will allow the database to be dropped
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'CodeClub')
BEGIN
    ALTER DATABASE CodeClub 
    SET SINGLE_USER 
    WITH ROLLBACK IMMEDIATE;
END
--------------------------------------------- 

GO
DROP DATABASE IF EXISTS CodeClub;
GO
CREATE DATABASE CodeClub;
GO
USE CodeClub;
GO
CREATE TABLE Account(
	ID INTEGER IDENTITY,
	DiscordUsername VARCHAR(255) NOT NULL,
	CodeforcesUsername VARCHAR(255) NULL,
	KattisUsername VARCHAR(255) NULL,
	ShowElo BIT DEFAULT 0 NOT NULL,
	Nickname VARCHAR(255) NOT NULL,

	CONSTRAINT PK_Account PRIMARY KEY(ID),

	-- Each username must be unique
	CONSTRAINT AK_Account_DiscordUsername UNIQUE(DiscordUsername),
	--CONSTRAINT AK_Account_CodeforcesUsername UNIQUE(CodeforcesUsername),
	--CONSTRAINT AK_Account_KattisUsername UNIQUE(KattisUsername),
	-- CONSTRAINT AK_Account_Nickname UNIQUE(Nickname) -- Nickname isn't null because it's just a way to display their names
);

CREATE INDEX IX_Account_DiscordUsername ON Account(DiscordUsername);
GO

Create TABLE AccountElo(
	ID INTEGER IDENTITY,
	Total REAL DEFAULT 0, -- Can be a negative or a positive
	AccountID INTEGER NOT NULL,
	CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
	CONSTRAINT PK_AccountElo PRIMARY KEY(ID),
	CONSTRAINT FK_AccountElo_Account FOREIGN KEY (AccountID) REFERENCES Account(ID) ON DELETE CASCADE
);


---- Points can be calculated like this
--SELECT a.UserName as Username, SUM(ap.Total) AS Points
--FROM AccountPoints ap INNER JOIN Account a
--	ON ap.AccountID = a.ID
--GROUP BY a.Id, a.Username;
---- SELECT SUM(Total) FROM AccountPoints;