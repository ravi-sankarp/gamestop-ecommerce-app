import asyncHandler from 'express-async-handler';
import { ObjectId } from 'mongodb';
import { getDb } from '../config/db.js';
import { deleteProductsByCategoryId } from './productService.js';

//get all category data with product count
export const findAllCategories = asyncHandler(async () => {
  const agg = [
    {
      $match: {
        isDeleted: false
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'categoryId',
        as: 'products'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        bannerImg: 1,
        totalProducts: {
          $size: '$products'
        }
      }
    }
  ];
  const categories = await getDb().collection('categories').aggregate(agg).toArray();
  return categories;
});

//check if category name already exists
export const checkCategoryNameExists = asyncHandler(async (id, name) => {
  const objId = ObjectId(id);
  const category = await getDb()
    .collection('categories')
    .findOne({
      _id: { $ne: objId },
      isDeleted: false,
      name: { $regex: `^${name.trim()}$`, $options: 'i' }
    });
  return category;
});

//Create a new category
export const createNewCategory = asyncHandler(async (data) => {
  await getDb().collection('categories').insertOne(data);
});

//find a category by Object Id
export const findCategoryById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  const category = await getDb().collection('categories').findOne({ _id, isDeleted: false });
  return category;
});

//update category data with Id
export const updateCategoryById = asyncHandler(async (id, data) => {
  const _id = ObjectId(id);
  await getDb()
    .collection('categories')
    .updateOne({ _id }, { $set: { ...data } });
});

//delete a category and products belonging to that category
export const deleteCategoryById = asyncHandler(async (id) => {
  const _id = ObjectId(id);
  await getDb()
    .collection('categories')
    .updateOne({ _id }, { $set: { isDeleted: true } });
  await deleteProductsByCategoryId(id);
});
