import React, { useEffect } from "react";
import { Button } from "@mantine/core";
import { fetchWordLists, saveWordLists } from "@/slices/wordListsSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { totalWordsSelector } from "@/slices/wordListsSlice";
import { selectCurrentUser } from "@/slices/usersSlice";

export default function TestPage() {
  const dispatch = useAppDispatch();
  const wordLists = useAppSelector((state) => state.wordList.wordLists);
  const totalWords = useAppSelector(totalWordsSelector);
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(fetchWordLists());
  }, [dispatch]);

  const handleAddWord = () => {
    if (!currentUser) {
      alert("Please log in first");
      return;
    }

    dispatch(
      saveWordLists({
        user: currentUser.sub,
        rank: "100",
        word: "hello",
      })
    );
  };

  return (
    <div>
      <Button
        size="xs"
        variant="outline"
        color="green"
        className="mb-2"
        fullWidth
        onClick={handleAddWord}
      >
        Add a word
      </Button>

      <ul>
        {wordLists.map((item, index) => (
          <li key={index}>
            {item.user} : {item.rank} - {item.word}
          </li>
        ))}
      </ul>
      <div>Total Words Count: {totalWords}</div>
    </div>
  );
}