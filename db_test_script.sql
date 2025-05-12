USE CodeClub;
GO

SELECT a.*, SUM(ae.Total) AS TotalPoints
FROM Account a INNER JOIN AccountElo ae
ON a.ID = ae.AccountID
GROUP BY a.ID, a.DiscordUsername, a.CodeforcesUsername, a.KattisUsername, a.ShowElo

SELECT * FROM Contest;

SELECT cp.ID, c.Name, c.Site, a.DiscordUsername, a.CodeforcesUsername, a.KattisUsername
FROM ContestParticipant cp
INNER JOIN Contest c 
ON cp.ContestID = c.ID
INNER JOIN Account a 
ON a.ID = cp.AccountID;

--INSERT INTO AccountElo(Total, AccountID)
--VALUES(-200, 20), (15, 15)

--INSERT INTO AccountElo(Total, AccountID)
--VALUES(200, 20), (-15, 15)

--INSERT INTO AccountElo(Total, AccountID)
--VALUES(17, 13)

--UPDATE Account SET CodeforcesUsername = 'HarryVu176', ShowElo = 1 WHERE DiscordUsername = '709795509661073539';