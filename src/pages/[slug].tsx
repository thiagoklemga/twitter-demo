import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User gas not posted</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
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
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";

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
