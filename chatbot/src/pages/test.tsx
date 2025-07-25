import React, { useEffect } from "react";
import { Button } from "@mantine/core";
import { fetchWordLists, saveWordLists } from "@/slices/wordListsSlice";
import { useAppDispatch, useAppSelector, RootState } from "@/store";
import { totalWordsSelector } from "@/slices/wordListsSlice";

export default function TestPage() {
  const dispatch = useAppDispatch();
  const wordLists = useAppSelector((state) => state.wordList.wordLists);
  const totalWords = useAppSelector(totalWordsSelector);
  const thisUser = useAppSelector((state) => state.user.users);

  useEffect(() => {
    dispatch(fetchWordLists());
  }, [dispatch]);

  return (
    <div>
      <Button
        size="xs"
        variant="outline"
        color="green"
        className="mb-2"
        fullWidth
        onClick={() => {
          dispatch(saveWordLists({ user: thisUser[0].sub, rank: "100", word: "hello", }))
        }}
      >
        Add a word
      </Button>

      <ul>
        {wordLists.map((item, index) => (
          <li key={index}>
            {item.rank} - {item.word}
          </li>
        ))}
      </ul>
      <div>Totol Words Count: {totalWords}</div>
    </div>
  );
}
