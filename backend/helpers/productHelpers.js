import asyncHandler from 'express-async-handler';
import { Int32, ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//Find all products
export const findAllProducts = asyncHandler(async (query) => {
  const agg = [
    {
      $match: {
        isDeleted: false
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand'
      }
    }
  ];
  if (query) {
    if (query.category) {
      if (query.category.includes(',')) {
        const categories = query.category.split(',');
        agg.push({ $match: { 'category.0.name': { $in: categories } } });
      } else {
        agg.push({ $match: { 'category.0.name': query.category } });
      }
    }
    if (query.brand) {
      if (query.brand.includes(',')) {
        const brands = query.brand.split(',');
        agg.push({ $match: { 'brand.0.name': { $in: brands } } });
      } else {
        agg.push({ $match: { 'brand.0.name': query.brand } });
      }
    }
    if (query.minPrice || query.maxPrice) {
      agg.push({
        $match: {
          discountedPrice: {
            $gte: Number(query.minPrice) ?? 0,
            $lte: Number(query.maxPrice) ?? 50000
          }
        }
      });
    }
    if (query.search) {
      agg.push({
        $match: {
          name: {
            $regex: `.*${query.search}.*`,
            $options: 'i'
          }
        }
      });
    }
    if (query.sort) {
      if (query.sort.includes('price')) {
        if (query.sort === 'priceAsc') {
          agg.push({ $sort: { discountedPrice: 1 } });
        } else {
          agg.push({ $sort: { discountedPrice: -1 } });
        }
      } else if (query.sort.includes('recommended')) {
        agg.push({ $sort: { name: 1 } });
      } else if (query.sort.includes('newest')) {
        agg.push({ $sort: { createdOn: 1 } });
      } else {
        const { sort } = query;

        agg.push({ $sort: { [sort]: 1 } });
      }
    }
  }
  const products = await getDb().collection('products').aggregate(agg).toArray();
  return products;
});

//find all products name and id
export const findProductNames = asyncHandler(async () => {
  const product = await getDb()
    .collection('products')
    .find({ isDeleted: false })
    .project({ name: 1 })
    .toArray();
  return product;
});

//find total products count
export const findTotalProducts = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        isDeleted: false
      }
    },
    {
      $group: {
        _id: null,
        totalProducts: {
          $sum: 1
        }
      }
    }
  ];
  const [count] = await getDb().collection('products').aggregate(agg).toArray();
  return count;
});

//add new product
export const createNewProduct = asyncHandler(async (data) => {
  data.price = Int32(data.price);
  data.discount = Int32(data.discount);
  data.categoryId = ObjectId(data.categoryId);
  data.brandId = ObjectId(data.brandId);
  data.stock = Int32(data.stock);
  data.rating = Int32(data.rating);
  await getDb().collection('products').insertOne(data);
});

//Find a product by Id
export const findProductById = asyncHandler(async (id) => {
  const _id = ObjectId(id);

  const product = await getDb().collection('products').findOne({ _id, isDeleted: false });
  return product;
});

//Find a products by category Id
export const findProductByCategoryId = asyncHandler(async (id, brId, proId) => {
  const categoryId = ObjectId(id);
  const query = {
    categoryId,
    isDeleted: false
  };
  if (brId) {
    query.brandId = { $ne: ObjectId(brId) };
  }
  if (proId) {
    query._id = { $ne: ObjectId(proId) };
  }

  const products = await getDb().collection('products').find(query).toArray();
  return products;
});

//Find a product by brand id
export const findProductByBrandId = asyncHandler(async (id, proId) => {
  const brandId = ObjectId(id);
  const query = {
    isDeleted: false,
    brandId
  };
  if (proId) {
    query._id = { $ne: ObjectId(proId) };
  }

  const products = await getDb().collection('products').find(query).toArray();
  return products;
});

//Find Product by Id with category and brand data
export const findProductByIdAggregation = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  const agg = [
    {
      $match: {
        _id,
        isDeleted: false
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand'
      }
    }
  ];
  const product = await getDb().collection('products').aggregate(agg).toArray();
  return product[0];
});

//Update product by Id
export const updateProductById = asyncHandler(async (id, data) => {
  const _id = ObjectId(id);
  data.price = Int32(data.price);
  data.discount = Int32(data.discount);
  data.categoryId = ObjectId(data.categoryId);
  data.brandId = ObjectId(data.brandId);
  data.stock = Int32(data.stock);
  data.rating = Int32(data.rating);

  await getDb()
    .collection('products')
    .updateOne({ _id }, { $set: { ...data } });
});

//Delete a product by product Id
export const deleteProductById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  await getDb()
    .collection('products')
    .updateOne({ _id }, { $set: { isDeleted: true, stock: 0 } });
});

//Delete all products by category Id
export const deleteProductsByCategoryId = asyncHandler(async (id) => {
  const categoryId = ObjectId(id);
  await getDb()
    .collection('products')
    .updateMany({ categoryId }, { $set: { isDeleted: true, stock: 0 } });
});

//Delete all products by Brand Id
export const deleteProductsByBrandId = asyncHandler(async (id) => {
  const brandId = ObjectId(id);
  await getDb()
    .collection('products')
    .updateMany({ brandId }, { $set: { isDeleted: true, stock: 0 } });
});

//Update product stock after a successfull order
export const updateProductStock = asyncHandler(async (id, count) => {
  const _id = ObjectId(id);
  await getDb()
    .collection('products')
    .updateOne(
      { _id },
      {
        $inc: {
          stock: count
        }
      }
    );
});

//Update product discount after adding a new product offer
export const updateDiscountedPrice = asyncHandler(async (id, type, discount) => {
  const updatequery = [
    { $set: { [type]: discount } },
    {
      $set: {
        discount: {
          $switch: {
            branches: [
              {
                case: { $gte: ['$categoryDiscount', '$productDiscount'] },
                then: '$categoryDiscount'
              },
              {
                case: { $gte: ['$productDiscount', '$categoryDiscount'] },
                then: '$productDiscount'
              }
            ],
            default: 0
          }
        }
      }
    },
    {
      $set: {
        discountedPrice: {
          $trunc: [
            { $subtract: ['$price', { $multiply: [{ $divide: ['$discount', 100] }, '$price'] }] },
            0
          ]
        }
      }
    }
  ];
  const matchquery = {};
  if (type === 'categoryDiscount') {
    matchquery.categoryId = ObjectId(id);
  } else if (type === 'productDiscount') {
    matchquery._id = ObjectId(id);
  }
  await getDb().collection('products').updateMany(matchquery, updatequery);
});

// search for a product
export const productSearch = asyncHandler(async (query) => {
  const agg = [
    {
      $match: {
        isDeleted: false
      }
    },
    {
      $project: {
        name: 1,
        image: {
          $arrayElemAt: ['$images', 0]
        }
      }
    },
    {
      $project: {
        name: 1,
        image: '$image.imgUrl'
      }
    },
    {
      $limit: 4
    }
  ];
  if (query) {
    agg.unshift({
      $match: {
        name: {
          $regex: `.*${query}.*`,
          $options: 'i'
        }
      }
    });
  }

  const product = await getDb().collection('products').aggregate(agg).toArray();
  return product;
});

// find the similar products
export const findSimilarProducts = asyncHandler(async (id) => {
  const { brandId, categoryId } = await findProductById(id);
  const [productsByBrandId, productsByCategoryId] = await Promise.all([
    findProductByBrandId(brandId, id),
    findProductByCategoryId(categoryId, brandId, id)
  ]);
  return [...productsByBrandId, ...productsByCategoryId];
});

// update product rating
export const updateProductRating = asyncHandler(async (id, rating) => {
  const _id = ObjectId(id);
  await getDb().collection('products').updateOne(
    { _id },
    {
      $set: {
        rating
      }
    }
  );
});

// Find featured Product
export const findFeaturedProducts = asyncHandler(async () => {
  const products = await getDb()
    .collection('products')
    .find({ $expr: { $lt: ['$discountedPrice', '$price'] } }).limit(4)
    .toArray();
  return products;
});
