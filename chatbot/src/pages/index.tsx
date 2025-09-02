import Head from "next/head";
import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <>
      <Head>
        <title>Corpus AI Coach</title>
        <meta name="description" content="Master spoken English with AI role-play conversations. Learn high-frequency vocabulary curated from the BNC and COCA corpora. Build fluency & confidence fast!" />
      </Head>
      <main>
        <Chat></Chat>
      </main>
    </>
  );
}