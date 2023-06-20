import { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { buttonVariants } from '@/components/ui/button'
import SubscribeLeaveToggle from '@/components/subscribe-leave-toggle'
import ToFeedButton from '@/components/feed/to-feed-button'
import { normalizeSlug } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'BuzzBox',
  description: 'A community built with Next.js and TypeScript.',
}

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode
  params: { slug: string }
}) => {
  const session = await getAuthSession()

  const hive = await db.hive.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          hive: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      })

  const isSubscribed = !!subscription

  if (!hive) return notFound()

  const memberCount = await db.subscription.count({
    where: {
      hive: {
        name: slug,
      },
    },
  })

  return (
    <div className='mx-auto h-full max-w-7xl sm:container'>
      <div className='flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl bg-gradient-to-r from-background to-muted py-4'>
        <div>
          <ToFeedButton />
        </div>
        <h1 className='text-3xl font-bold md:text-4xl'>hive/{hive.name}</h1>
      </div>
      <div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
        <ul className='col-span-2 flex list-none flex-col space-y-6'>
          {children}
        </ul>

        {/* info sidebar */}
        <div className='order-first h-fit overflow-hidden rounded-lg border bg-background md:order-last'>
          <div className='px-6 py-4'>
            <p className='py-3 font-semibold'>About hive/{hive.name}</p>
          </div>
          <dl className='divide-y divide-accent px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <dt className='text-muted-foreground'>Created</dt>
              <dd className='text-muted-foreground'>
                <time dateTime={hive.createdAt.toDateString()}>
                  {format(hive.createdAt, 'MMMM d, yyyy')}
                </time>
              </dd>
            </div>
            <div className='flex justify-between gap-x-4 py-3'>
              <dt className='text-muted-foreground'>Members</dt>
              <dd className='flex items-start gap-x-2'>
                <div className='text-muted-foreground'>{memberCount}</div>
              </dd>
            </div>
            {hive.creatorId === session?.user?.id ? (
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-muted-foreground'>
                  You created this community
                </dt>
              </div>
            ) : null}
          </dl>
          <div className='px-4 pb-8'>
            {hive.creatorId !== session?.user?.id ? (
              <SubscribeLeaveToggle
                isSubscribed={isSubscribed}
                hiveId={hive.id}
                hiveName={hive.name}
              />
            ) : null}

            {session ? (
              <Link
                className={buttonVariants({
                  variant: 'secondary',
                  className: 'w-full',
                })}
                href={`/hive/${normalizeSlug(slug)}/submit`}
              >
                Create Post
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
