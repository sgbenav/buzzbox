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
    <ul className='overflow-hidden rounded-md border px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4'>
      <div className='flex gap-x-4 flex-grow'>
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
          className='w-full border-0 bg-muted'
        />
      </div>
      <div className='flex items-center justify-end gap-x-4'>
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
