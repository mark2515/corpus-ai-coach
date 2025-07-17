export interface User {
  name: string;
  image: string;
}

const users: User[] = [
  {
    name: 'user1',
    image: '/images/user1.jpg',
  },
  {
    name: 'user2',
    image: '/images/user2.jpg',
  },
];

export default users;