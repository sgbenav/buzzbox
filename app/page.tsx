import Link from 'next/link'
import { Home as HomeIcon } from 'lucide-react'

import { getAuthSession } from '@/lib/auth'
import { buttonVariants } from '@/components/ui/button'
import CustomFeed from '@/components/feed/custom-feed'
import GeneralFeed from '@/components/feed/general-feed'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
  const session = await getAuthSession()

  return (
    <>
      <h1 className='text-3xl font-bold md:text-4xl'>Your feed</h1>
      <div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
        {/* @ts-expect-error server component */}
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* subreddit info */}
        <div className='order-first h-fit overflow-hidden rounded-lg border bg-card md:order-last'>
          <div className='px-6 py-4'>
            <p className='flex items-center gap-2 py-3 font-semibold'>
              <HomeIcon className='h-4 w-4' />
              Home
            </p>
          </div>
          <dl className='px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4'>
              <p className='text-muted-foreground'>
                Your personal Breadit frontpage. Come here to check in with your
                favorite communities.
              </p>
            </div>
            <div>
              <Link
                className={buttonVariants({
                  variant: 'secondary',
                  className: 'mb-6 mt-4 w-full cursor-pointer',
                })}
                href={`/hive/create`}
              >
                Create Community
              </Link>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
