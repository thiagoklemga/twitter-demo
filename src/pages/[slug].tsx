import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: "thiagoklemga",
  });

  console.log(data);

  if (!data) return <div>Something went wrong here</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative mb-24 h-48 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile picture`}
            width={96}
            height={96}
            className={
              "absolute -bottom-14  ml-4 rounded-full border-4 border-gray-900"
            }
          />
        </div>
        <div className="p-4 text-2xl">{`@${data.username ?? ""}`}</div>
      </PageLayout>
    </>
  );
};

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("Slug is not a string");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
