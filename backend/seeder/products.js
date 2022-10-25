import { ObjectId } from 'mongodb';

const productData = [
  {
    _id: ObjectId('6325e60c8fb9caa3266df643'),
    name: 'AMD  Ryzen 7 5800X',
    price: 62000,
    discountedPrice: 43400,
    discount: 30,
    categoryId: ObjectId('6325d89c8fb9caa3266df640'),
    brandId: ObjectId('6325d2a38fb9caa3266df63c'),
    details:
      'AMD Ryzen 7 5800X 3.8 GHz Upto 4.7 GHz AM4 Socket 8 Cores 16 Threads Desktop Processor  (Silver)',
    keyFeatures:
      'CPU Cores:8,Number of threads:16,L3 Cache:4MB,Default TDP:105W,Unblocked for Overclocking:Yes,\r\nBase Clock:3.8GHz,Max Boost Clock:Up to 4.7GHz',
    description:
      'Whatever the setting, whatever the resolution, lead your team to victory with the world’s best 8-core gaming processor. With boost clocks up to 4.7 GHz2, 8 cores, 16 threads, and 36MB of cache you can expect maximum performance for games, while encoding high-resolution video for the best quality stream. Configuring and customizing your rig has never been easier. AMD Ryzen™ 5000 Series desktop processors can be dropped into any AMD 500 Series motherboards with a simple BIOS update. AMD Ryzen™ Master utility gets you real-time access to temperatures, fan speeds, memory timings, core voltage, and CPU frequencies, plus easy switchable profiles. It is the perfect tool for users looking to fine-tune and get more from their AMD Ryzen™ unlocked processor.3. Ultimate performance. Seamless compatibility. Get an incredible Windows 11 gaming experience with AMD Ryzen™ Processors.',
    stock: 10,
    rating: 4,
    images: [
      {
        public_id: 'products/mc7mjvvvvhnor3l2s5kc',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435307/products/b0hx9xn2sfjbdmu7f0fy.jpg'
      },
      {
        public_id: 'products/tcj1voihfcwfhfmdayfd',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435307/products/tcj1voihfcwfhfmdayfd.jpg'
      },
      {
        public_id: 'products/bep02vf3shliuwjdifax',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435307/products/bep02vf3shliuwjdifax.jpg'
      },
      {
        public_id: 'products/b0hx9xn2sfjbdmu7f0fy',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435307/products/mc7mjvvvvhnor3l2s5kc.jpg'
      }
    ],
    createdOn: {
      $timestamp: {
        t: 0,
        i: 1275764898
      }
    },
    categoryDiscount: 20,
    productDiscount: 30,
    isDeleted: false
  },
  {
    _id: ObjectId('6325e7778fb9caa3266df644'),
    name: 'Intel Core i9 10th Gen  ',
    price: 65000,
    discountedPrice: 52000,
    discount: 20,
    categoryId: ObjectId('6325d89c8fb9caa3266df640'),
    brandId: ObjectId('6325d9058fb9caa3266df641'),
    details:
      'Intel Core i9 10850K 10th Gen Generation Desktop PC Processor CPU APU with 20MB Cache and up to 5.2 GHz Unlocked Speed 3 Years Warranty LGA 1200 4K (Graphic Card Not Required)',
    keyFeatures:
      'CPU Cores:8,Number of threads:16,L3 Cache:3MB,Default TDP:100W,Unblocked for Overclocking:Yes,\r\nBase Clock:3.9GHz,Max Boost Clock:Up to 5GHz',
    description:
      'Intel Core i9 10850K 10th Gen Generation Desktop PC Processor CPU APU. The i9 10850K has Total 10 Cores and 20 Threads. This Processor or CPU is K version and hence it can be overclocked to speed upto 5.2 GHz for ultimate Gaming and 4k and 8K Video editing.',
    stock: 6,
    rating: 4,
    images: [
      {
        public_id: 'products/yrbj3rx3ggho5y3mtqpf',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435739/products/yrbj3rx3ggho5y3mtqpf.jpg'
      },
      {
        public_id: 'products/yqhbzngcdaaxkxrlmmmx',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435739/products/yqhbzngcdaaxkxrlmmmx.jpg'
      },
      {
        public_id: 'products/tvefwg7013dypecvgra8',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435739/products/tvefwg7013dypecvgra8.jpg'
      },
      {
        public_id: 'products/o3fgdsy62pr8evcjcyuj',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435739/products/o3fgdsy62pr8evcjcyuj.jpg'
      }
    ],
    createdOn: {
      $timestamp: {
        t: 0,
        i: 1276128019
      }
    },
    categoryDiscount: 20,
    productDiscount: 20,
    isDeleted: false
  },
  {
    _id: ObjectId('6325e8f48fb9caa3266df645'),
    name: 'Tower ATX PC Case',
    price: 30000,
    discountedPrice: 24000,
    discount: 20,
    categoryId: ObjectId('6321c943dd09312845abe752'),
    brandId: ObjectId('6325d4b38fb9caa3266df63e'),
    details: 'iCUE 5000T RGB Tempered Glass Mid-Tower ATX PC Case — Black',
    keyFeatures:
      'Cooling Method:Air,Material:Alloy Steel,Hard Disk Form Factor:3.5 inches,Motherboard Compatability:Mini ITX,Case Type:Mid Tower,Color:Black',
    description:
      'Make a lasting impression with the 5000T RGB’s unique style, lit by an astonishing 208 individually addressable RGB LEDs, all with the clean design and builder-friendly features for which the 5000T Series is renowned.\r\nWith 160 RGB LEDs integrated into the front, roof, and floor panels, plus 48 LEDs in the included fans, you’ll get vibrant, fully customizable RGB lighting from any angle, right out of the box.',
    stock: 11,
    rating: 1,
    images: [
      {
        public_id: 'products/qmr9d7wkpckdsagyedys',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666437143/products/qmr9d7wkpckdsagyedys.webp'
      },
      {
        public_id: 'products/ro1nuzbax0cfyk4atqdz',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666437143/products/ro1nuzbax0cfyk4atqdz.jpg'
      },
      {
        public_id: 'products/rlenqmdbk17copdnjfty',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436899/products/rlenqmdbk17copdnjfty.jpg'
      },
      {
        public_id: 'products/wsdowv2xe0l5t7szgksc',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436899/products/wsdowv2xe0l5t7szgksc.jpg'
      }
    ],
    createdOn: {
      $timestamp: {
        t: 0,
        i: 1276508636
      }
    },
    categoryDiscount: 20,
    productDiscount: 0,
    isDeleted: false
  },
  {
    _id: ObjectId('6325e9f38fb9caa3266df646'),
    name: 'MSI Mid-Tower Case  ',
    price: 20000,
    discountedPrice: 16000,
    discount: 20,
    categoryId: ObjectId('6321c943dd09312845abe752'),
    brandId: ObjectId('6321cb769bd5a23f81ccf3d4'),
    details:
      'MSI MPG Series Premium Mid-Tower Gaming PC Case: Tempered Glass Side Panel, ARGB 120mm Fans, Liquid Cooling Support up to 360mm Radiator, Two-Tone Design, MPG GUNGNIR 110R (B0899H96NQ)',
    keyFeatures:
      'Cooling Method:Nitrogen,Material:Alloy Steel,Hard Disk Form Factor:1.5 inches,Motherboard Compatability:Mini ITX,Case Type:Tower,Color:Black,Watt:30W',
    description:
      'TEMPERED GLASS SIDE PANEL - The side panel consists of tempered glass that can clearly showcase the fans’ ARGB lighting and build without any obstruction.\r\nARGB SHOWROOM - Customize your colors with 4 included ARGB 120mm fans, all supported by MSI Mystic Light\r\nINSTA-LIGHT LOOP - Insta-Light Loop button allows users to quickly cycle through ARGB lighting effects and color profiles.',
    stock: 10,
    rating: 3,
    images: [
      {
        public_id: 'products/r2kibbgtnyzae5dcifxz',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436444/products/r2kibbgtnyzae5dcifxz.jpg'
      },
      {
        public_id: 'products/qiviarudceojyo7cdpfe',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436444/products/qiviarudceojyo7cdpfe.jpg'
      },
      {
        public_id: 'products/ckypnajiefrbq628ahho',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436444/products/ckypnajiefrbq628ahho.jpg'
      },
      {
        public_id: 'products/smljaguaokyi6hv90ncs',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436444/products/smljaguaokyi6hv90ncs.jpg'
      }
    ],
    createdOn: {
      $timestamp: {
        t: 0,
        i: 1276764434
      }
    },
    categoryDiscount: 20,
    productDiscount: 0,
    isDeleted: false
  },
  {
    _id: ObjectId('6325eaf08fb9caa3266df647'),
    name: 'MSI 850W Power Supply',
    price: 15000,
    discountedPrice: 15000,
    discount: 0,
    categoryId: ObjectId('6325d40d8fb9caa3266df63d'),
    brandId: ObjectId('6321cb769bd5a23f81ccf3d4'),
    details: 'MSI MPG A850GF 850W 80 Plus Gold Certified Power Supply (306-7ZP0C18-CE0)',
    keyFeatures: 'Cooling Method:Air,Wattage:850W,Item Weight:700g,Warranty:5 years',
    description:
      'Full modular cable design\r\n80 Plus Gold certified for high efficiency\r\n100% all Japanese 105oC capacitor\r\nFlat cable equipment\r\n10-year warranty',
    stock: 20,
    rating: 4,
    images: [
      {
        public_id: 'products/pmuykowpw6y7xjxu9u3h',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436307/products/pmuykowpw6y7xjxu9u3h.jpg'
      },
      {
        public_id: 'products/fgq4iwxmrvv77e7goqox',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436307/products/fgq4iwxmrvv77e7goqox.jpg'
      },
      {
        public_id: 'products/qvrsxovlorhhgkwzq8ca',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436307/products/qvrsxovlorhhgkwzq8ca.jpg'
      },
      {
        public_id: 'products/j4h1pmk1t0w5grkjetks',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436307/products/j4h1pmk1t0w5grkjetks.jpg'
      }
    ],
    createdOn: {
      $timestamp: {
        t: 0,
        i: 1277017364
      }
    },
    categoryDiscount: 0,
    productDiscount: 0,
    isDeleted: false
  },
  {
    _id: ObjectId('6325eba08fb9caa3266df648'),
    name: 'ASUS ROG Thor 950 ',
    price: 10000,
    discountedPrice: 7700,
    discount: 23,
    categoryId: ObjectId('6325d40d8fb9caa3266df63d'),
    brandId: ObjectId('6325d1e38fb9caa3266df63b'),
    details:
      'ASUS ROG Thor 950 Certified 850W Fully-Modular RGB Power Supply with LiveDash OLED Panel (ROG-THOR-950P)',
    keyFeatures: 'Cooling Method:Nitrogen,Wattage:950W,Item Weight:400g,Warranty:5 years',
    description:
      'Aura Sync : Advanced customization with addressable RGB LEDs and Aura Sync compatibility\r\nOLED Power Display : Real-time power draw monitoring with OLED Power Display\r\nROG Thermal Solution : 0dB cooling with dustproof IP5X Wing-blade Fan and ROG heatsink design\r\n80 PLUS Platinum : Built with 100% Japanese capacitors and other premium components\r\nSleeved Cables : For easy building and superior aesthetics',
    stock: 10,
    rating: 4,
    images: [
      {
        public_id: 'products/ggzge1e8jodalqolkckj',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436049/products/ggzge1e8jodalqolkckj.jpg'
      },
      {
        public_id: 'products/p73cfm599fvsxpiv3t1f',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436049/products/p73cfm599fvsxpiv3t1f.jpg'
      },
      {
        public_id: 'products/cbmr7mrwovjenck90hht',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436049/products/cbmr7mrwovjenck90hht.jpg'
      },
      {
        public_id: 'products/nge5v9icntxmgnzwfef3',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436049/products/nge5v9icntxmgnzwfef3.jpg'
      }
    ],
    createdOn: {
      $timestamp: {
        t: 0,
        i: 1277192959
      }
    },
    categoryDiscount: 0,
    productDiscount: 23,
    isDeleted: false
  },
  {
    _id: ObjectId('6325ed0d8fb9caa3266df649'),
    name: 'ASUS Flare Keyboard',
    price: 5000,
    discountedPrice: 5000,
    discount: 0,
    categoryId: ObjectId('6325d6c28fb9caa3266df63f'),
    brandId: ObjectId('6325d1e38fb9caa3266df63b'),
    details:
      'ASUS ROG Strix Flare (Cherry MX Red) Aura Sync RGB Mechanical Gaming Keyboard with Switches, Customizable Badge, USB Pass Through and Media Controls',
    keyFeatures: 'Backlit:RGB,Type:Wireless,Color:Cherry MX Red,Weight:400g',
    description:
      'Cherry MX RGB switches for faster response times and enhanced gaming performance\r\n100% anti-ghosting, full key rollover, and onboard memory for on-the-fly macro recording\r\nCustomizable logo badge for adding your own flare to your gaming station\r\nASUS Aura Sync RGB lighting features a nearly endless spectrum of colors with the ability to synchronize effects across an ever-expanding ecosystem of Aura Sync enabled products\r\nIntegrated Media Controls keep your hands on the keyboard during intense gaming sessions',
    stock: 19,
    rating: 5,
    images: [
      {
        public_id: 'products/qkns5qhj6qeze63bqh64',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435040/products/qkns5qhj6qeze63bqh64.jpg'
      },
      {
        public_id: 'products/elwomafkdryomz6mggd6',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435040/products/elwomafkdryomz6mggd6.jpg'
      },
      {
        public_id: 'products/bltljc6htvj9mvyr5hat',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435040/products/bltljc6htvj9mvyr5hat.jpg'
      },
      {
        public_id: 'products/kxnv6sb55i573345uezz',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666435040/products/kxnv6sb55i573345uezz.jpg'
      }
    ],
    createdOn: {
      $timestamp: {
        t: 0,
        i: 1277558108
      }
    },
    categoryDiscount: 0,
    productDiscount: 0,
    isDeleted: false
  },
  {
    _id: ObjectId('6325edd38fb9caa3266df64a'),
    name: 'MSI Vigor GK20',
    price: 3200,
    discountedPrice: 3200,
    discount: 0,
    categoryId: ObjectId('6325d6c28fb9caa3266df63f'),
    brandId: ObjectId('6321cb769bd5a23f81ccf3d4'),
    details:
      'MSI Vigor GK20 US Backlit RGB Wired Dedicated Hotkeys Anti-Ghosting Water Resistant Gaming Keyboard Black',
    keyFeatures: 'Backlit:RGB,Type:Wired,Color:Black,Weight:300g',
    description:
      'Rainbow Lighting Effect\r\nWater Repellent.\r\nConnectivity Technology: Wired\r\n1.8m with gold-plated connector.\r\nEnjoy 12-key anti-ghosting (QWERASDFZXCV) on GK20 keyboard for absolute control in games.',
    stock: 19,
    rating: 5,
    images: [
      {
        public_id: 'products/qnszcybtmkua06ijlosq',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436563/products/qnszcybtmkua06ijlosq.jpg'
      },
      {
        public_id: 'products/jc7vwtqotubq6ivwjcsw',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436562/products/jc7vwtqotubq6ivwjcsw.jpg'
      },
      {
        public_id: 'products/maf7hjirn5xneu0fbxoz',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436563/products/maf7hjirn5xneu0fbxoz.jpg'
      },
      {
        public_id: 'products/qvudxtzlzf1nqumfyxp3',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666436562/products/qvudxtzlzf1nqumfyxp3.jpg'
      }
    ],
    createdOn: {
      $timestamp: {
        t: 0,
        i: 1277755654
      }
    },
    categoryDiscount: 0,
    productDiscount: 0,
    isDeleted: false
  },
  {
    _id: ObjectId('6357b68ee4a696a85460b7f8'),
    name: 'GeForce RTX™ 3070',
    price: 78000,
    discount: 25,
    discountedPrice: 58500,
    productDiscount: 0,
    categoryDiscount: 25,
    categoryId: ObjectId('6357b5e5e4a696a85460b7f5'),
    brandId: ObjectId('6357b60ee4a696a85460b7f7'),
    details:
      ' PNY GeForce RTX™ 3070 8GB XLR8 Gaming Revel Epic-X RGB™ Triple Fan Graphics Card LHR',
    keyFeatures:
      'Graphic Card RAM Type:8GB,Graphic RAM Type:GDDR6,Wattage:650 Watts,Item Weight:1kg 490g\r\n',
    description:
      'The GeForce RTX™ 3070 is powered by Ampere—NVIDIA’s 2nd gen RTX architecture. Built with enhanced RT Cores and Tensor Cores, new streaming multiprocessors, and high-speed G6 memory, it gives you the power you need to rip through the most demanding games. The all-new NVIDIA Ampere architecture features new 2nd generation Ray Tracing Cores and 3rd generation Tensor Cores with greater throughput.',
    stock: 31,
    rating: 4,
    images: [
      {
        public_id: 'products/egmsrlkugiwaivqbktmk',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666692749/products/egmsrlkugiwaivqbktmk.jpg'
      },
      {
        public_id: 'products/yx7qlvpde1peerg8lcjm',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666692750/products/yx7qlvpde1peerg8lcjm.jpg'
      },
      {
        public_id: 'products/sabtflrlrq8ysgb0jjhb',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666692749/products/sabtflrlrq8ysgb0jjhb.jpg'
      },
      {
        public_id: 'products/arl3u6uqky3l9qmj6juq',
        imgUrl:
          'https://res.cloudinary.com/djyemfefu/image/upload/v1666692750/products/arl3u6uqky3l9qmj6juq.jpg'
      }
    ],
    isDeleted: false
  }
];

export default productData;
