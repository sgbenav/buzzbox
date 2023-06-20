import { z } from 'zod'

import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)

  const session = await getAuthSession()

  let followedCommunitiesIds: string[] = []

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        hive: true,
      },
    })

    console.log(followedCommunities)

    followedCommunitiesIds = followedCommunities.map((sub) => sub.hive.id)
  }

  try {
    const { limit, page, hiveName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        hiveName: z.string().nullish().optional(),
      })
      .parse({
        hiveName: url.searchParams.get('hiveName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      })

    let whereClause = {}

    if (hiveName) {
      whereClause = {
        hive: {
          name: hiveName,
        },
      }
    } else if (session) {
      whereClause = {
        hive: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      }
    }

    const posts = await db.post.findMany({
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        hive: true,
        votes: true,
        author: true,
        comments: true,
      },
      where: whereClause,
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response('Could not fetch posts', { status: 500 })
  }
}
