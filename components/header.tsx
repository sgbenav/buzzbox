import Link from 'next/link'
import { getServerSession } from 'next-auth'

import { siteConfig } from '@/config/site'
import { authOptions } from '@/lib/auth'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserAccountMenu } from '@/components/user-account-menu'

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className='sticky top-0 z-40 w-full'>
      <div className='w-full bg-gradient-to-r from-background to-red-500 pb-1'>
        <div className='bg-background'>
          <nav className='container h-16 flex justify-between'>
            <Link href='/' className='flex items-center space-x-2'>
              <Icons.logo className='h-6 w-6 outline outline-2' />
              <span className='inline-block font-bold'>{siteConfig.name}</span>
            </Link>

            <div className='flex items-center gap-x-2'>
              {/* actions */}
              {session?.user ? (
                <UserAccountMenu user={session.user} />
              ) : (
                <Link
                  href='/sign-in'
                  className={buttonVariants({
                    variant: 'outline',
                  })}
                >
                  Sign In
                </Link>
              )}
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
