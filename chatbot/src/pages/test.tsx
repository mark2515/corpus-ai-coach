import React, { useEffect } from "react";
import { Button } from "@mantine/core";
import { fetchWordLists, saveWordLists } from "@/slices/wordListsSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { totalWordsSelector } from "@/slices/wordListsSlice";
import { selectCurrentUser } from "@/slices/usersSlice";
import Link from "next/link";
import Cookies from "js-cookie";
import { User } from "@/types";

export default function TestPage() {
  const dispatch = useAppDispatch();
  const wordLists = useAppSelector((state) => state.wordList.wordLists);
  const totalWords = useAppSelector(totalWordsSelector);
  const googleUser = Cookies.get("googleUser");
  const guestUser = Cookies.get("guestUser");
  const currentUser: User | null = googleUser ? JSON.parse(googleUser) : null;


  useEffect(() => {
    dispatch(fetchWordLists());
    console.log(guestUser);
  }, [dispatch]);

  const handleAddWord = () => {
    if (!currentUser) {
      alert("Please log in first");
      return;
    }

    dispatch(
      saveWordLists({
        user: currentUser._id,
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
      <Link href="/" passHref>
        <Button
          size="xs"
          variant="light"
          color="blue"
          className="mb-4"
          fullWidth
        >
          Back to Home
        </Button>
      </Link>
    </div>
  );
}