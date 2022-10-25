import { getDb, initDb } from '../config/db.js';
import bannerData from './banners.js';
import brandData from './brands.js';
import categoryData from './categories.js';
import offerData from './offers.js';
import productData from './products.js';
import userData from './users.js';

initDb(async (err, _db) => {
  if (err) {
    console.log(err);
  } else {
    try {
      // deleting all the existing content in the database
      await getDb().dropDatabase();

      //inserting all the data
      await Promise.all([
        getDb().collection('categories').insertMany(categoryData),
        getDb().collection('brands').insertMany(brandData),
        getDb().collection('products').insertMany(productData),
        getDb().collection('banners').insertMany(bannerData),
        getDb().collection('offers').insertMany(offerData),
        getDb().collection('users').insertOne(userData)
      ]);
      console.log('Data inserted Successfully');
      process.exit();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
});
