// Basic getters

export const getAdditionalServices = `SELECT * FROM additionalService`;

export const getAllStations = 'SELECT * FROM station';

export const getStationByName = `
SELECT * FROM station
WHERE name = ?
`;

// Data creation

export const createStation = `
INSERT INTO station
(name)
VALUES (?)
`;

export const createTrain = `
INSERT INTO train
(arrivalDate, departureDate, departureStationId, arrivalStationId)
VALUES (?, ?, ?, ?)
`;

export const createWagon = `
INSERT INTO wagon
(wagonNumber, wagonType, seatsAmount, price, trainId)
VALUES (?, ?, ?, ?, ?)
`;

export const createClient = `
INSERT INTO client
(phoneNumber, name, surname, birthDate, email)
VALUES (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
	name = VALUES(name),
    surname = VALUES(surname),
    birthDate = VALUES(birthDate),
    email = VALUES(email)
`;

export const createTicket = `
INSERT INTO ticket
(clientId, trainId, wagonId, seatNumber, status)
VALUES (?, ?, ?, ?, ?)
`;

export const createTransaction = `
INSERT INTO transaction
(value, paymentType, paymentStatus, paymentDate, ticketId)
VALUES (?, ?, ?, ?, ?)
`;

export const createService = `
INSERT INTO additionalService
(serviceName, price)
VALUES (?, ?)
`;

export const addTicketService = `
INSERT INTO ticketService
(ticketId, serviceId)
VALUES (?, ?)
`;

// Custom queries for booking

export const selectTrainById = `
SELECT train.*,
	(
		SELECT name FROM station WHERE stationId = train.departureStationId
    ) as departureStation,
	(
		SELECT name FROM station WHERE stationId = train.arrivalStationId
    ) as arrivalStation
FROM train
WHERE trainId = ?
`;

export const selectTrains = `
SELECT train.*, MIN(price) AS startingPrice, 
	(
		SELECT name FROM station WHERE stationId = train.departureStationId
    ) as departureStation,
	(
		SELECT name FROM station WHERE stationId = train.arrivalStationId
    ) as arrivalStation
FROM wagon, train
WHERE train.departureStationId = 2
AND train.arrivalStationId = 1
AND DATE(train.departureDate) = '2025-05-31'
AND train.departureDate > NOW()
AND seatsAmount > (
	SELECT COUNT(*)
	FROM ticket
	WHERE ticket.wagonId = wagon.wagonId
    )
GROUP BY train.trainId;
`;

export const selectWagonsForTrain = `
SELECT *, wagon.seatsAmount - (
	SELECT COUNT(*)
    FROM ticket
    WHERE ticket.wagonId = wagon.wagonId
	) as freeSeats
FROM wagon
WHERE wagon.trainId = ?
HAVING freeSeats > 0
`;

export const selectFreeSeatsNumberForWagon = `
WITH RECURSIVE allSeats AS (
    SELECT 0 AS seatNumber
    UNION ALL
    SELECT seatNumber + 1
    FROM allSeats
    WHERE seatNumber < (
        SELECT COALESCE(seatsAmount, 0)
        FROM wagon
        WHERE wagon.wagonId = 1
    )
)
SELECT seatNumber
FROM allSeats
WHERE seatNumber NOT IN (
    SELECT seatNumber 
    FROM ticket
    WHERE ticket.wagonId = 1
)
ORDER BY seatNumber;
`;

// Complex queries

export const getAllActiveTrains = `
SELECT train.*, 
	(
		SELECT name FROM station WHERE stationId = train.departureStationId
    ) as departureStation,
	(
		SELECT name FROM station WHERE stationId = train.arrivalStationId
    ) as arrivalStation
FROM train
WHERE train.departureDate > NOW()
`;

export const getTotalSalesByTrainId = `
SELECT wagon.wagonNumber, wagon.wagonType, wagon.seatsAmount,
	(
		SELECT COUNT(*)
        FROM ticket
        WHERE ticket.trainId = train.trainId
        AND ticket.wagonId = wagon.wagonId
    ) as seatsBought
FROM wagon
JOIN train USING (trainId)
WHERE trainId = ?
`;
