# Ratings & Reviews Service
This API service is designed to perform CRUD operations related to ratings and reviews data of specific products for the Atelier e-commerce client.

## Table of Contents

1. [Service Routes](#service-routes)
2. [Installation](#installation)
3. [Other Services](#other-services)

## Service Routes

### Add a Review

Adds a review for the given product.

`POST /reviews`

Body Parameters

| **Parameter**   | **Type** | **Description** |
| --------------- | -------- | --------------- |
| product_id      | integer  | Required ID of the product to post the review for. |
| rating          | integer  | Integer (1-5) indicating the review rating. |
| summary         | text     | Summary text of the review. |
| body            | text     | Continued or full text of the review. |
| recommend       | boolean  | Value indicating if the reviewer recommends the product. |
| name            | text     | Username for reviewer. |
| email           | text     | Email address for reviewer. |
| photos          | [text]   | Array of text urls that link to images to be displayed. |
| characteristics | object   | Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...} |

Response: `Status: 201 CREATED`

### List Reviews

Returns a list of reviews for a particular product. This list *does not* include any reported reviews.

`GET /reviews/`

Query Parameters

| **Parameter** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| product_id    | integer  | Specifies the product for which to retrieve reviews. |
| page          | integer  | Selects the page of results to return. Default 1. |
| count         | integer  | Specifies how many results per page to return. Default 5. |

Response: `Status: 200 OK`

```
{
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    },
    // ...
  ]
}
```

### Get Review Metadata

Returns review metadata for a given product.

`GET /reviews/meta`

Query Parameters

| **Parameter** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| product_id    | integer  | Required ID of the product for which data should be returned. |

Response: `Status: 200 OK'

```
{
  "product_id": "2",
  "ratings": {
    2: 1,
    3: 1,
    4: 2,
    // ...
  },
  "recommended": {
    0: 5
    // ...
  },
  "characteristics": {
    "Size": {
      "id": 14,
      "value": "4.0000"
    },
    "Width": {
      "id": 15,
      "value": "3.5000"
    },
    "Comfort": {
      "id": 16,
      "value": "4.0000"
    },
    // ...
}
```

### Update a Review as Helpful

Updates a review to show it was found helpful.

`PUT /reviews/:review_id/helpful`

Parameters

| **Parameter** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| review_id     | integer  | Required ID of the review to update. |

Response `Status: 204 NO CONTENT`

### Report a Review

Updates a review to show it was reported. Note, this action does not delete the review, but the review will not be returned in teh above GET request.

`PUT /reviews/:review_id/report`

Parameters

| **Parameter** | **Type** | **Description** |
| ------------- | -------- | --------------- |
| review_id     | integer  | Required ID of the review to update. |

Response `Status: 204 NO CONTENT`

## Installation

To utilize this service:
  1. Fork and clone the repository to a local directory
  2. Run `npm install` to install dependencies
  3. Create a `.env` file with the following properties:
    - `PASSWORD="DATABASE_PASSWORD"`
    - `HOST="HOST_IP"`
    - `USER="DATABASE_USERNAME"`
  4. Run `npm start` to start the server

## Other Services

Additional services that contribute to the Atieler Product API can be viewed below:
 - [Products](https://github.com/rpp33-sdc-tulip/products-api) by Muizz Matemilola
 - [Questions & Answers](https://github.com/rpp33-sdc-tulip/questions-answers-api) by Jeff Sparrow
