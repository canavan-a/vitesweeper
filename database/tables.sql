DROP TABLE IF EXISTS scores;

CREATE TABLE scores(
	id SERIAL PRIMARY KEY,
	score INT NOT NULL,
	board_size VARCHAR(50) NOT NULL,
	username VARCHAR(255) NOT NULL,
	date_recorded DATE DEFAULT CURRENT_DATE
);