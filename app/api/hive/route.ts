import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { HiveValidator } from '@/lib/validators/hive'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = HiveValidator.parse(body)

    // check if hive already exists
    const hiveExists = await db.hive.findFirst({
      where: {
        name,
      },
    })

    if (hiveExists) {
      return new Response('Hive already exists', { status: 409 })
    }

    // create hive and associate it with the user
    const hive = await db.hive.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    })

    // creator also has to be subscribed
    await db.subscription.create({
      data: {
        userId: session.user.id,
        hiveId: hive.id,
      },
    })

    return new Response(hive.name)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response('Could not create hive', { status: 500 })
  }
}