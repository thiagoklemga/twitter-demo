import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { type RouterOutputs } from "~/utils/api";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="flex items-center gap-4 border-b p-8">
      <Image
        src={author.profileImageUrl}
        width={56}
        height={56}
        alt={`@${author.username}'s profile picture`}
        className=" rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-1">
          <Link href={`/@${author.username}`} className="font-bold">
            {`@${author.username}`}
          </Link>
          <Link href={`/post/${post.id}`}>{` · ${dayjs(
            post.createdAt
          ).fromNow()}`}</Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};
