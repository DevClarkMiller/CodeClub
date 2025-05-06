USE CodeClub;
GO

SELECT a.*, SUM(ae.Total) AS TotalPoints
FROM Account a INNER JOIN AccountElo ae
ON a.ID = ae.AccountID
GROUP BY a.ID, a.DiscordUsername, a.CodeforcesUsername, a.KattisUsername, a.ShowElo

--INSERT INTO AccountElo(Total, AccountID)
--VALUES(-200, 20), (15, 15)

--INSERT INTO AccountElo(Total, AccountID)
--VALUES(200, 20), (-15, 15)

--INSERT INTO AccountElo(Total, AccountID)
--VALUES(17, 13)

-- UPDATE Account SET CodeforcesUsername = 'HarryVu176' WHERE ID = 2 