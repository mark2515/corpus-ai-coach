export interface WordLists {
  user: String;
  rank: String;
  word: String;
}

const wordLists: WordLists[] = [
  {
    user: "user1_sub",
    rank: '1',
    word: 'the',
  },
  {
    user: "user2_sub",
    rank: '2',
    word: 'be',
  },
  {
    user: "user1_sub",
    rank: '3',
    word: 'and',
  },
  {
    user: "user1_sub",
    rank: '4',
    word: 'of',
  },
];

export default wordLists;