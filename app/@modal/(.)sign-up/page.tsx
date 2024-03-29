import SignUp from '@/components/auth/sign-up'
import CloseModal from '@/components/close-modal'

export default function Page() {
  return (
    <div className='fixed inset-0 z-10 bg-muted/95'>
      <div className='container mx-auto flex h-full max-w-lg items-center'>
        <div className='relative h-fit w-full rounded-lg border bg-background px-2 py-20'>
          <div className='absolute right-4 top-4'>
            <CloseModal />
          </div>

          <SignUp />
        </div>
      </div>
    </div>
  )
}
