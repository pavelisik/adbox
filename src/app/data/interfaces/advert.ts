export interface AdvertDemo {
    id: number;
    title: string;
    price: number;
    address: string;
    time: string;
    image: string;
    link: string;
}

export interface Advert {
    id: string;
    name: string | null;
    location: string | null;
    createdAt: string;
    isActive: boolean;
    imagesIds: string[] | null;
    cost: number;
}

export interface AdvertSearchRequest {
    search: string;
    showNonActive: boolean;
    category: string;
}

// ПОТОМ ВОТ ТАКОЕ ОБЪЯВЛЕНИЕ ЗАТИПИЗИРОВАТЬ

// {
//   "id": "24fefe92-753f-48fb-99c6-5ba7f5060ad6",
//   "user": {
//     "id": "e2bd9b02-6b36-4a3a-bdb2-238502cedcc3",
//     "name": "Pavel"
//   },
//   "name": "Акустическая гитара Martin D41",
//   "description": "Реплика акустической гитары Martin D41, звучит просто крышесносно, как и выглядит",
//   "isActive": true,
//   "imagesIds": [
//     "087ba1ac-c108-45e3-9f5e-ab119bdcc32d"
//   ],
//   "cost": 30000,
//   "email": "test@test.com",
//   "phone": "8900000000",
//   "location": "Санкт-Петербург",
//   "created": "2025-09-03T17:38:42.101018Z",
//   "category": {
//     "id": "c40f82b1-511a-4293-8c71-44bbb2b1e36c",
//     "parentId": "00000000-0000-0000-0000-000000000000",
//     "name": "Хобби и отдых"
//   }
// }
