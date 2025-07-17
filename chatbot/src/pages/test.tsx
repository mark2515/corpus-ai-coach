import React from "react";
import { Button } from "@mantine/core";
import { addWordLists } from "@/slices/wordListsSlice";
import { useAppDispatch, useAppSelector } from "@/store";

export default function TestPage() {
  const dispatch = useAppDispatch();
  const wordLists = useAppSelector((state) => state.wordList.wordLists);

  return (
    <div>
      <Button
        size="xs"
        variant="outline"
        color="green"
        className="mb-2"
        fullWidth
        onClick={() =>
          dispatch(addWordLists({ word: "hello", rank: "100" }))
        }
      >
        Add a word
      </Button>

      {/* Word list display */}
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
