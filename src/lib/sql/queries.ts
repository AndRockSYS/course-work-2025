export const createTrain = `
INSERT INTO train
(arrivalDate, departureDate, departureStation, arrivalStation)
VALUES (?, ?, ?, ?)
`;

export const createWagon = `
INSERT INTO wagon
(wagonNumber, wagonType, seatsAmount, price, trainId)
VALUES(?, ?, ?, ?, ?)
`;

export const createClient = `
INSERT INTO client
(phoneNumber, name, surname, birthDate, email)
(?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE id = id`;

export const createTicket = `
INSERT INTO ticket
(clientId, trainId, wagonId, seatNumber, status)
(?, ?, ?, ?)
`;

export const createTransaction = `
INSERT INTO transaction
(value, paymentType, paymentStatus, paymentDate, ticketId)
(?, ?, ?, ?, ?)
`;

export const addTicketService = `
INSERT INTO ticketService
(ticketId, serviceId)
(?, ?)
`;

export const searchTrains = `
SELECT * FROM train
WHERE train.departureStation = ?
AND train.arrivalStation = ?
AND train.departureDate = ?
AND train.departureDate >= NOW()
`;

export const getWagonsForTrain = `
SELECT * FROM wagon
WHERE wagon.trainId = ?
`;

export const selectTakesSeatsForWagon = `
SELECT ticket.seatNumber as taken FROM ticket
JOIN wagon USING(trainId)
WHERE ticket.wagonId = ?
`;

export const getAdditionalServices = `SELECT * FROM additionalService`;
