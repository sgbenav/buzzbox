import Link from 'next/link'
import { Home as HomeIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function HomeCommunityCard() {
  return (
    <Card className='order-first h-fit overflow-hidden md:order-last'>
      <CardHeader className='space-y-1 bg-muted'>
        <CardTitle className='flex items-center gap-2 text-xl'>
          <HomeIcon className='h-6 w-6' />
          Home
        </CardTitle>
      </CardHeader>
      <CardContent className='mt-8'>
        <CardDescription>
          Your personal BuzzBox frontpage. Come here to check in with your
          favorite communities.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link
          className={buttonVariants({
            variant: 'secondary',
            className: 'mb-6 mt-4 w-full cursor-pointer',
          })}
          href={`/hive/create`}
        >
          Create Community
        </Link>
      </CardFooter>
    </Card>
  )
}
