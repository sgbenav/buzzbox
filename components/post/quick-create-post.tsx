'use client'

import { FC } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Image as ImageIcon, Link2 } from 'lucide-react'
import type { Session } from 'next-auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { UserAvatar } from '@/components/user-avatar'

interface QuickCreatePostProps {
  session: Session | null
}

const QuickCreatePost: FC<QuickCreatePostProps> = ({ session }) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <ul className='overflow-hidden rounded-md border'>
      <div className='flex h-full justify-between gap-6 p-8'>
        <div className='relative'>
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white' />
        </div>
        <Input
          onClick={() => router.push(pathname + '/submit')}
          readOnly
          placeholder='Create post'
          className='border-0 bg-muted'
        />
        <Button
          onClick={() => router.push(pathname + '/submit')}
          variant='ghost'
        >
          <ImageIcon className='text-muted-foreground' />
        </Button>
        <Button
          onClick={() => router.push(pathname + '/submit')}
          variant='ghost'
        >
          <Link2 className='text-muted-foreground' />
        </Button>
      </div>
    </ul>
  )
}

export default QuickCreatePost
