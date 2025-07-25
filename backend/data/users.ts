export interface Users {
  sub: String;
  name: String;
  email: String;
  picture: String;
}

const users: Users[] = [
  {
    sub: 'user1_sub',
    name: 'user1',
    email: 'user1@gmail.com',
    picture: '/images/user1.jpg',
  },
  {
    sub: 'user2_sub',
    name: 'user2',
    email: 'user2@gmail.com',
    picture: '/images/user2.jpg',
  },
];

export default users;