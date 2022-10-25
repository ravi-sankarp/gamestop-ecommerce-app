import { ObjectId } from 'mongodb';

const brandData = [
  {
    _id: ObjectId('6321cb769bd5a23f81ccf3d4'),
    name: 'MSI',
    description:
      'As a world leading gaming brand, MSI is the most trusted name in gaming and eSports.We sell a wide variety of products ranging from peripherals to laptops.',
    bannerImg: {
      public_id: 'brand/vdsejapzuc3qussdmycf',
      imgUrl:
        'https://res.cloudinary.com/djyemfefu/image/upload/v1663159158/brand/vdsejapzuc3qussdmycf.png'
    },
    isDeleted: false
  },
  {
    _id: ObjectId('6325d1e38fb9caa3266df63b'),
    name: 'ASUS',
    description:
      'ASUS is the world’s No. 1 motherboard and gaming brand as well as a top-three consumer notebook vendor.We sell the best gaming laptops and peripherals.',
    bannerImg: {
      public_id: 'brand/bye6jktq0wrligwiysdq',
      imgUrl:
        'https://res.cloudinary.com/djyemfefu/image/upload/v1663422946/brand/bye6jktq0wrligwiysdq.webp'
    },
    isDeleted: false
  },
  {
    _id: ObjectId('6325d2a38fb9caa3266df63c'),
    name: 'AMD',
    description:
      'AMD is the leading producer of gaming chipsets.We sell processors with integrated graphics which are suited for gaming.',
    bannerImg: {
      public_id: 'brand/bge9aeqeqp4rimf3q8zx',
      imgUrl:
        'https://res.cloudinary.com/djyemfefu/image/upload/v1663423139/brand/bge9aeqeqp4rimf3q8zx.webp'
    },
    isDeleted: false
  },
  {
    _id: ObjectId('6325d4b38fb9caa3266df63e'),
    name: 'Corsair',
    description:
      'CORSAIR, a world leader in enthusiast components for gamers, creators, and PC builders, has the PC hardware and gaming gear you need to Do Your Thing.',
    bannerImg: {
      public_id: 'brand/htrn0jr0zd7acehclyo8',
      imgUrl:
        'https://res.cloudinary.com/djyemfefu/image/upload/v1663423666/brand/htrn0jr0zd7acehclyo8.webp'
    },
    isDeleted: false
  },
  {
    _id: ObjectId('6325d9058fb9caa3266df641'),
    name: 'Intel',
    description:
      'Explore a wide range of processors with extensive performance.We are the leading producers of processors in the world.',
    bannerImg: {
      public_id: 'brand/cqlt8dyycixgtcgxjwol',
      imgUrl:
        'https://res.cloudinary.com/djyemfefu/image/upload/v1663424773/brand/cqlt8dyycixgtcgxjwol.webp'
    },
    isDeleted: false
  },
  {
    _id: ObjectId('6357b60ee4a696a85460b7f7'),
    name: 'Nvidia',
    description:
      'NVIDIA pioneered accelerated computing to tackle challenges no one else can solve. Today, our work in AI is transforming 100 trillion dollars of industries—from gaming to healthcare to transportation—and profoundly impacting society.  ',
    bannerImg: {
      public_id: 'brand/i9mmrkep1trofuq8unsj',
      imgUrl:
        'https://res.cloudinary.com/djyemfefu/image/upload/v1666692622/brand/i9mmrkep1trofuq8unsj.jpg'
    },
    isDeleted: false
  }
];

export default brandData;
