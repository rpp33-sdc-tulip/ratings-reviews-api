const insertQueryPhotos = (reviewId, photos) => {
  let query = 'INSERT INTO photos (review_id, photoUrl) VALUES ';
  for (let i = 0; i < photos.length; i += 1) {
    if (i === photos.length - 1) {
      query = `${query}(${reviewId}, "${photos[i]}");`;
    } else {
      query = `${query}(${reviewId}, "${photos[i]}"), `;
    }
  }
  return query;
}

const insertQueryCharacteristics = (reviewId, characteristics) => {
  let query = 'INSERT INTO reviews_characteristics (review_id, characteristic_id, characteristicValue) VALUES ';
  const keys = Object.keys(characteristics);
  for (let i = 0; i < keys.length; i += 1) {
    if (i === keys.length - 1) {
      query = `${query}(${reviewId}, "${keys[i]}", ${characteristics[keys[i]]});`;
    } else {
      query = `${query}(${reviewId}, "${keys[i]}", ${characteristics[keys[i]]}), `;
    }
  }
  return query;
};

module.exports.insertQueryPhotos = insertQueryPhotos;
module.exports.insertQueryCharacteristics = insertQueryCharacteristics;
