import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  duration: '60s',
  vus: 10,
};

const testPostReview = () => {
  const newReviewData = {
    product_id: 1000000,
    rating: 5,
    summary: 'so cheap, so good',
    body: "This is the best product ever. I can't recommend moore highly. Buy yourself one, or ten, you won't regret it!",
    recommend: true,
    name: 'test',
    email: 'test@test.com',
    photos: ['www.photo1.com', 'www.photo2.com'],
    characteristics: JSON.stringify({
      3347638: 5,
      3347639: 5,
      3347640: 5,
      3347641: 1,
    }),
  };
  http.post('http://localhost:8080/reviews', newReviewData);
  sleep(1);
};

export default testPostReview;
