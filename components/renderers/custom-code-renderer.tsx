'use client'

function CustomCodeRenderer({ data }: any) {
  (data)

  return (
    <pre className='bg-gray-800 rounded-md p-4'>
      <code className='text-muted-foreground text-sm'>{data.code}</code>
    </pre>
  )
}

export default CustomCodeRenderer