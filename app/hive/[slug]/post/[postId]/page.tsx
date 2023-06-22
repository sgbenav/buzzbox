import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Post, User, Vote } from '@prisma/client'
import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react'

import { CachedPost } from '@/types/redis'
import { db } from '@/lib/db'
import { redis } from '@/lib/redis'
import { formatTimeToNow } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import CommentsSection from '@/components/comment/comment-section'
import EditorOutput from '@/components/editor/editor-output'
import PostVoteServer from '@/components/post/post-vote-server'

interface SubHivePostPageProps {
  params: {
    postId: string
  }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const SubHivePostPage = async ({ params }: SubHivePostPageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost

  let post: (Post & { votes: Vote[]; author: User }) | null = null

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    })
  }

  if (!post && !cachedPost) return notFound()

  return (
    <section className='relative'>
      <div className='flex h-full flex-col items-center justify-between sm:flex-row sm:items-start'>
      <div className='absolute -left-11 md:-left-16 top-4 h-36 w-14 overflow-hidden [&>*]:pr-0'>
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              })
            }}
          />
        </Suspense>
      </div>
        <div className='w-full flex-1 rounded-sm border bg-card p-8 sm:w-0'>
          <p className='mt-1 max-h-40 truncate text-xs text-muted-foreground'>
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className='py-2 text-xl font-semibold leading-6 text-accent-foreground'>
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />
          <Suspense
            fallback={
              <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
            }
          >
            <CommentsSection postId={post?.id ?? cachedPost.id} comments={[]} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

function PostVoteShell() {
  return (
    <div className='flex w-20 flex-col items-center pr-6'>
      {/* upvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigUp className='h-5 w-5 text-muted-foreground' />
      </div>

      {/* score */}
      <div className='py-2 text-center text-sm font-medium text-accent-foreground'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: 'ghost' })}>
        <ArrowBigDown className='h-5 w-5 text-muted-foreground' />
      </div>
    </div>
  )
}

export default SubHivePostPage
