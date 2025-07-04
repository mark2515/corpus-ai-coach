export interface User {
  _id: string;
  name: string;
  image: string;
}

const users: User[] = [
  {
    _id: '1',
    name: 'user1',
    image: '/images/user1.jpg',
  },
  {
    _id: '2',
    name: 'user2',
    image: '/images/user2.jpg',
  },
];

export default users;