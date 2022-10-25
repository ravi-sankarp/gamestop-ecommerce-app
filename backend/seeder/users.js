import { ObjectId } from 'mongodb';

const userData = {
  _id: ObjectId('63207794fa2b0db2a6113f85'),
  email: 'admin@gmail.com',
  firstName: 'admin',
  lastName: 'user',
  phoneNumber: '9744875101',
  password: '$2a$12$S7FeJ5dBhn7zvrFNy6lSte4FS3s5BhErR5dWm1dBp75zcHQr7TYRy',
  isBlocked: false,
  isAdmin: true,
  googleAuth: false
};
export default userData;
