DROP TABLE IF EXISTS boston_data;

CREATE TABLE boston_data (
	id FLOAT PRIMARY KEY,
	name VARCHAR(200) NOT NULL,
	host_id INT,
	host_acceptance_rate FLOAT,
	host_total_listings_count INT,
	neighbourhood VARCHAR(50),
	latitude FLOAT,
	longitude FLOAT,
	property_type VARCHAR(50),
	room_type VARCHAR(50),
	accommodates INT,
	bathrooms DECIMAL(2,1),
	bedrooms INT,
	beds INT,
	price FLOAT,
	minimum_nights INT,
	maximum_nights INT,
	review_scores_rating FLOAT,
	review_scores_accuracy FLOAT,
	review_scores_cleanliness FLOAT,
	review_scores_checkin FLOAT,
	review_scores_communication FLOAT,
	review_scores_location FLOAT,
	review_scores_value FLOAT
);

SELECT * FROM boston_data;