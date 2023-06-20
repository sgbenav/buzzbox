import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostValidator } from '@/lib/validators/post'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { title, content, hiveId } = PostValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // verify user is subscribed to passed hive id
    const subscription = await db.subscription.findFirst({
      where: {
        hiveId,
        userId: session.user.id,
      },
    })

    if (!subscription) {
      return new Response('Subscribe to post', { status: 403 })
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        hiveId,
      },
    })

    return new Response('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not post to hive at this time. Please try later',
      { status: 500 }
    )
  }
}