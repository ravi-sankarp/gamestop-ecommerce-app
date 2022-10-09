import asyncHandler from 'express-async-handler';
import { Int32, ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';

//Find all products
export const findAllProducts = asyncHandler(async (query) => {
  const agg = [
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
        $match: { discountedPrice: { $gte: Number(query.minPrice) ?? 0, $lte: Number(query.maxPrice) ?? 50000 } }
      });
    }
  }
  const products = await getDb().collection('products').aggregate(agg).toArray();
  // const sortedProducts = await products.sort({ discountedPrice: 1 }).toArray();
  // console.log(sortedProducts);
  return products;
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

  const product = await getDb().collection('products').findOne({ _id });
  return product;
});

//Find Product by Id with category and brand data
export const findProductByIdAggregation = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  const agg = [
    {
      $match: {
        _id
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
  console.log(product);
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
  await getDb().collection('products').deleteOne({ _id });
});

//Delete all products by category Id
export const deleteProductsByCategoryId = asyncHandler(async (id) => {
  const categoryId = ObjectId(id);
  await getDb().collection('products').deleteMany({ categoryId });
});

//Delete all products by Brand Id
export const deleteProductsByBrandId = asyncHandler(async (id) => {
  const brandId = ObjectId(id);
  await getDb().collection('products').deleteMany({ brandId });
});