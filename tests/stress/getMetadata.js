import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  duration: '60s',
  vus: 10,
};

// TEST RANDOM PRODUCTS FROM LAST 10% OF DATABASE

const productId = Math.floor(Math.random() * (1000011 - 900011) + 900011);

const testGetMetadata = () => {
  http.get(`http://localhost:8080/reviews/meta?product_id=${productId}`);
  sleep(1);
};

export default testGetMetadata;
