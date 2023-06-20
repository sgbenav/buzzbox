import { Editor } from '@/components/editor/editor'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'

interface pageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: pageProps) => {
  const hive = await db.hive.findFirst({
    where: {
      name: params.slug
    }
  })

  if (!hive) return notFound()

  return (
    <div className='flex flex-col items-start gap-6'>
      {/* heading */}
      <div className='border-b pb-5'>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-accent-foreground'>
            Create Post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-gray-500'>
            in hive/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor hiveId={hive.id} />

      <div className='flex w-full justify-end'>
        <Button type='submit' variant="secondary" className='px-8 font-bold' form='hive-post-form'>
          Post
        </Button>
      </div>
    </div>
  )
}

export default page
