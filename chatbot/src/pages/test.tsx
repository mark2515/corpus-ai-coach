import React, { useEffect } from "react";
import { Button } from "@mantine/core";
import { fetchWordLists, saveWordLists } from "@/slices/wordListsSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { totalWordsSelector } from "@/slices/wordListsSlice";

export default function TestPage() {
  const dispatch = useAppDispatch();
  const wordLists = useAppSelector((state) => state.wordList.wordLists);
  const totalWords = useAppSelector(totalWordsSelector);

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
        onClick={() =>
          dispatch(saveWordLists({ user: "user2_sub", rank: "100", word: "hello", }))
        }
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
