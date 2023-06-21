import { getAuthSession } from '@/lib/auth'
import CustomFeed from '@/components/feed/custom-feed'
import GeneralFeed from '@/components/feed/general-feed'
import HomeCommunityCard from '@/components/home-community'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Page() {
  const session = await getAuthSession()

  return (
    <div className='flex flex-col gap-10'>
      <h1 className='text-3xl font-bold md:text-4xl'>Your feed</h1>
      <div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
        {session ? <CustomFeed /> : <GeneralFeed />}
        <HomeCommunityCard />
      </div>
    </div>
  )
}
