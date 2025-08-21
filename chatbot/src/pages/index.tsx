import Head from "next/head";
import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <>
      <Head>
        <title>Corpus AI Coach</title>
        <meta name="description" content="Corpus AI Coach - Your intelligent conversation partner" />
      </Head>
      <main>
        <Chat></Chat>
      </main>
    </>
  );
}