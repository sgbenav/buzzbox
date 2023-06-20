'use client'

import { usePathname } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'

const ToFeedButton = () => {
  const pathname = usePathname()

  // if path is /hive/mycom, turn into /
  // if path is /hive/mycom/post/cligad6jf0003uhest4qqkeco, turn into /hive/mycom

  const hivePath = getHivePath(pathname)

  return (
    <a href={hivePath} className={buttonVariants({ variant: 'ghost' })}>
      <ChevronLeft className='mr-1 h-4 w-4' />
      {hivePath === '/' ? 'Back home' : 'Back to community'}
    </a>
  )
}

const getHivePath = (pathname: string) => {
  const splitPath = pathname.split('/')

  if (splitPath.length === 3) return '/'
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`
  // default path, in case pathname does not match expected format
  else return '/'
}

export default ToFeedButton
