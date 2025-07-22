export interface User {
  name: String;
  email: String;
  picture: String;
  sub: String;
}

const users: User[] = [
  {
    name: 'user1',
    email: 'user1@gmail.com',
    picture: '/images/user1.jpg',
    sub: 'user1_sub',
  },
  {
    name: 'user2',
    email: 'user2@gmail.com',
    picture: '/images/user2.jpg',
    sub: 'user2_sub',
  },
];

export default users;