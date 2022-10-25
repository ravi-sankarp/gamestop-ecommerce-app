import { ObjectId } from 'mongodb';

const offerData = [
  {
    _id: ObjectId('634518d9926c866f389ed25d'),
    type: 'Category Offer',
    categoryId: ObjectId('6325d89c8fb9caa3266df640'),
    discount: 20
  },
  {
    _id: ObjectId('63451b4ab43efc3ccf08ad30'),
    type: 'Product Offer',
    discount: 30,
    productId: ObjectId('6325e60c8fb9caa3266df643')
  },
  {
    _id: ObjectId('63452bdddf6af58cab7f7060'),
    type: 'Category Offer',
    categoryId: ObjectId('6321c943dd09312845abe752'),
    discount: 20
  },
  {
    _id: ObjectId('6349882cd049141524f05d22'),
    type: 'Product Offer',
    productId: ObjectId('6325e7778fb9caa3266df644'),
    discount: 20
  },
  {
    _id: ObjectId('63498869d049141524f05d24'),
    type: 'Product Offer',
    productId: ObjectId('6325eba08fb9caa3266df648'),
    discount: 23
  },
  {
    _id: ObjectId('6357b6dfe4a696a85460b7f9'),
    type: 'Category Offer',
    categoryId: ObjectId('6357b5e5e4a696a85460b7f5'),
    discount: 25
  }
];
export default offerData;
