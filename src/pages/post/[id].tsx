import { type NextPage } from "next";
import Head from "next/head";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className=" w-full border-x border-slate-200  md:max-w-2xl">
          Post
        </div>
      </main>
    </>
  );
};

export default SinglePostPage;
