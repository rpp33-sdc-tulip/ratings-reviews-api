import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  duration: '60s',
  vus: 10,
};

// TEST RANDOM PRODUCTS FROM LAST 10% OF DATABASE

const reviewId = Math.floor(Math.random() * (5774952 - 5197457) + 5197457);

const testPutHelpful = () => {
  const params = {
    review_id: reviewId,
  };
  http.put(`http://localhost:8080/reviews/${reviewId}/helpful`, null, params);
  sleep(1);
};

export default testPutHelpful;
