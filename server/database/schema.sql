CREATE DATABASE reviews;

USE reviews;

CREATE TABLE reviews (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  rating TINYINT,
  summary CHAR(60),
  recommend BOOLEAN,
  response VARCHAR(1000) NULL,
  body VARCHAR(1000),
  review_date CHAR(27),
  reviewer_name CHAR(60),
  helpfulness INT NOT NULL DEFAULT 0,
  email CHAR(60),
  reported BOOLEAN DEFAULT false,
  INDEX (product_id)
);

CREATE TABLE photos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  review_id BIGINT,
  photoUrl CHAR(255),
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);

CREATE TABLE characteristics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  characteristic CHAR(10),
  INDEX (product_id)
);

CREATE TABLE reviews_characteristics (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  review_id BIGINT,
  characteristic_id BIGINT,
  characteristicValue TINYINT,
  FOREIGN KEY (characteristic_id) REFERENCES characteristics(id),
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);