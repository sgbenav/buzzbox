import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config/scroll'
import { db } from '@/lib/db'
import PostFeed from '@/components/feed/post-feed'

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      hive: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS, 
  })

  return <PostFeed initialPosts={posts} />
}

export default GeneralFeed
