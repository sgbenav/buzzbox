import QuickCreatePost from '@/components/post/quick-create-post'
import PostFeed from '@/components/feed/post-feed'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config/scroll'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = params

  const session = await getAuthSession()

  const hive = await db.hive.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          hive: true,
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  })

  if (!hive) return notFound()

  return (
    <>
      <QuickCreatePost session={session} />
      <PostFeed initialPosts={hive.posts} hiveName={hive.name} />
    </>
  )
}

export default page