const { insertQueryPhotos, insertQueryCharacteristics } = require('./server/database/utilities/helpers');

describe('helper functions for POST queries', () => {
  test('insertQueryPhotos creates queries based on number of uploaded photos', () => {
    expect(insertQueryPhotos(2, ['www.google.com/image1', 'www.google.com/image2'])).toBe('INSERT INTO photos (review_id, photoUrl) VALUES (2, "www.google.com/image1"), (2, "www.google.com/image2");');
    expect(insertQueryPhotos(1, ['www.google.com/image1'])).toBe('INSERT INTO photos (review_id, photoUrl) VALUES (1, "www.google.com/image1");');
  });
  // test('insertQueryCharacteristics creates queries based on number of associated characteristics', () => {
  //   expect(insertQueryCharacteristics(2, [{ 1: 1, 2: 2 }])).toStrictEqual('INSERT INTO reviews_characteristics (review_id, characteristic_id, characteristicValue) VALUES (2, \"1\", 1), (2, \"2\", 2);');
  //   expect(insertQueryCharacteristics(1, [{ 1: 1 }])).toBe('INSERT INTO reviews_characteristics (review_id, characteristic_id, characteristicValue) VALUES (1, \"1\", 1);');
  // });
});

// describe('service routes integrate with database', () => {

// });
