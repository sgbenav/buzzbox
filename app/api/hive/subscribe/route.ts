import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { HiveSubscriptionValidator } from '@/lib/validators/hive'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { hiveId } = HiveSubscriptionValidator.parse(body)

    // check if user has already subscribed to hive
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        hiveId,
        userId: session.user.id,
      },
    })

    if (subscriptionExists) {
      return new Response("You've already subscribed to this hive", {
        status: 400,
      })
    }

    // create hive and associate it with the user
    await db.subscription.create({
      data: {
        hiveId,
        userId: session.user.id,
      },
    })

    return new Response(hiveId)
  } catch (error) {
    (error)
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response(
      'Could not subscribe to hive at this time. Please try later',
      { status: 500 }
    )
  }
}