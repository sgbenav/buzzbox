import Link from 'next/link'

import UserAuthForm from '@/components/auth/user-auth-form'
import { Icons } from '@/components/icons'

export default function SignIn() {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-6 w-6' />
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='mx-auto max-w-xs text-sm'>
          By continuing, you are setting up a BuzzBox account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className='px-8 text-center text-sm'>
        New to BuzzBox?{' '}
        <Link
          href='/sign-up'
          className='hover:text-brand text-sm underline underline-offset-4'
        >
          Sign Up
        </Link>
      </p>
    </div>
  )
}
