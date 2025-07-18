import React, { useEffect } from "react";
import { Button } from "@mantine/core";
import { addWordLists, fetchWordLists, saveWordLists } from "@/slices/wordListsSlice";
import { useAppDispatch, useAppSelector } from "@/store";

export default function TestPage() {
  const dispatch = useAppDispatch();
  const wordLists = useAppSelector((state) => state.wordList.wordLists);

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
          dispatch(saveWordLists({ word: "hello", rank: "100" }))
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
    </div>
  );
}
