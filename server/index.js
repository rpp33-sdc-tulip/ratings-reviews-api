/* eslint no-shadow: ["error", { "allow": ["err"] }] */

const express = require('express');
const mysql = require('mysql');
const { insertQueryCharacteristics } = require('./database/utilities/helpers');
const { insertQueryPhotos } = require('./database/utilities/helpers');

const app = express();
const port = 8080;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'reviews',
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  console.log('Connection established successfully');
});

app.use(express.json());

app.get('/reviews/', (req, res) => {
  const results = {
    product: req.query.product_id,
    page: req.query.page || 1,
    count: req.query.count || 5,
  };
  const productId = Number(results.product);
  const query = `SELECT R.id AS review_id, R.rating, R.summary, R.recommend, R.response, R.body, R.review_date AS date, R.reviewer_name, R.helpfulness, JSON_ARRAYAGG(JSON_OBJECT('id', P.id, 'url', P.photoURL)) AS photos
    FROM reviews R LEFT JOIN photos P ON R.id=P.review_id WHERE R.product_id=${productId} AND R.reported=0
    GROUP BY R.id LIMIT ${results.count * (results.page - 1)}, ${results.count}`;
  connection.query(query, (err, reviews) => {
    if (err) {
      throw err;
    }
    results.results = reviews;
    res.send(results);
  });
});

app.get('/reviews/meta', (req, res) => {
  const results = {
    product: req.body.product_id,
  };
  const productId = Number(results.product);
  const query = `SELECT
    (SELECT JSON_OBJECT(
      '1',
      (SELECT COUNT(rating)
        FROM reviews
        WHERE rating=1 AND product_id=${productId}),
      '2',
      (SELECT COUNT(rating)
        FROM reviews
        WHERE rating=2
        AND product_id=${productId}),
      '3',
      (SELECT COUNT(rating)
        FROM reviews
        WHERE rating=3 AND product_id=${productId}),
      '4',
      (SELECT COUNT(rating)
        FROM reviews
        WHERE rating=4 AND product_id=${productId}),
      '5',
      (SELECT COUNT(rating)
        FROM reviews
        WHERE rating=5 AND product_id=${productId})
    )) AS ratings,
    (SELECT JSON_OBJECT
      (
        '0',
        (SELECT COUNT(recommend)
          FROM reviews
          WHERE recommend=0 AND product_id=${productId}),
        '1',
        (SELECT COUNT(recommend)
          FROM reviews
          WHERE recommend=1 AND product_id=${productId})
      ))
      AS recommended,
    (SELECT GROUP_CONCAT(
        C.characteristic,
        JSON_OBJECT
          (
            'id',
            C.id,
            'value',
            (SELECT AVG(RC.characteristicValue)
            FROM reviews R
            INNER JOIN reviews_characteristics RC ON R.id=RC.review_id
            INNER JOIN characteristics C ON RC.characteristic_id=C.id
            WHERE R.product_id=${productId})
          )
      )
      FROM characteristics C
      WHERE C.product_id=${productId}
    ) AS characteristics
    ;`;
  connection.query(query, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

// const query = `SELECT
//     (SELECT JSON_OBJECT(
//       '1',
//       (SELECT COUNT(rating)
//         FROM reviews
//         WHERE rating=1 AND product_id=${productId}),
//       '2',
//       (SELECT COUNT(rating)
//         FROM reviews
//         WHERE rating=2
//         AND product_id=${productId}),
//       '3',
//       (SELECT COUNT(rating)
//         FROM reviews
//         WHERE rating=3 AND product_id=${productId}),
//       '4',
//       (SELECT COUNT(rating)
//         FROM reviews
//         WHERE rating=4 AND product_id=${productId}),
//       '5',
//       (SELECT COUNT(rating)
//         FROM reviews
//         WHERE rating=5 AND product_id=${productId})
//     )) AS ratings,
//     (SELECT JSON_OBJECT
//       (
//         '0',
//         (SELECT COUNT(recommend)
//           FROM reviews
//           WHERE recommend=0 AND product_id=${productId}),
//         '1',
//         (SELECT COUNT(recommend)
//           FROM reviews
//           WHERE recommend=1 AND product_id=${productId})
//       ))
//       AS recommended,
//     (SELECT GROUP_CONCAT(
//         C.characteristic,
//         JSON_OBJECT
//           (
//             'id',
//             C.id,
//             'value',
//             '0'
//           )
//       )
//       FROM characteristics C
//       WHERE C.product_id=${productId}
//     ) AS characteristics
//     ;`;
//   FROM reviews R
//   INNER JOIN reviews_characteristics RC ON R.id=RC.review_id
//   INNER JOIN characteristics C ON RC.characteristic_id=C.id
//   WHERE R.product_id=${productId})
//   AS characteristics

app.post('/reviews', (req, res) => {
  req.body.date = new Date().toISOString();
  const reviewQuery = `INSERT INTO reviews (product_id, rating, summary, body, recommend, review_date, reviewer_name, email) VALUES (${Number(req.body.product_id)}, ${Number(req.body.rating)}, "${req.body.summary}", "${req.body.body}", ${req.body.recommend}, "${req.body.date}", "${req.body.name}", "${req.body.email}");`;
  connection.query(reviewQuery, (err, results) => {
    if (err) {
      throw err;
    }
    const characteristicQuery = `${insertQueryCharacteristics(results.insertId, req.body.characteristics)}`;
    connection.query(characteristicQuery, (err) => {
      if (err) {
        throw err;
      }
      if (req.body.photos) {
        const photoQuery = `${insertQueryPhotos(results.insertId, req.body.photos)}`;
        connection.query(photoQuery, (err) => {
          if (err) {
            throw err;
          }
          res.sendStatus(201);
        });
      } else {
        res.sendStatus(201);
      }
    });
  });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const query = `UPDATE reviews SET helpfulness=helpfulness+1 WHERE id=${req.params.review_id}`;
  connection.query(query, (err) => {
    if (err) {
      throw err;
    }
    res.sendStatus(204);
  });
});

app.put('/reviews/:review_id/report', (req, res) => {
  const query = `UPDATE reviews SET reported=1 WHERE id=${req.params.review_id}`;
  connection.query(query, (err) => {
    if (err) {
      throw err;
    }
    res.sendStatus(204);
  });
});

app.listen(port, () => {
  console.log(`Ratings & Reviews API listening on port ${port}`);
});
