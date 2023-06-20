'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

import { CreateHivePayload } from '@/lib/validators/hive'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Page = () => {
  const router = useRouter()
  const [input, setInput] = useState<string>('')
  const { loginToast } = useCustomToasts()

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateHivePayload = {
        name: input,
      }

      const { data } = await axios.post('/api/hive', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Hive already exists.',
            description: 'Please choose a different name.',
            variant: 'destructive',
          })
        }

        if (err.response?.status === 422) {
          return toast({
            title: 'Invalid hive name.',
            description: 'Please choose a name between 3 and 21 letters.',
            variant: 'destructive',
          })
        }

        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      toast({
        title: 'There was an error.',
        description: 'Could not create hive.',
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      router.push(`/hive/${data}`)
    },
  })

  return (
    <div className='mx-auto flex h-full max-w-3xl items-center'>
      <div className='relative h-fit w-full space-y-6 rounded-lg border bg-background p-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-semibold'>Create a Community</h1>
        </div>

        <hr className='h-px' />

        <div>
          <p className='text-lg font-medium'>Name</p>
          <p className='pb-2 text-xs'>
            Community names including capitalization cannot be changed.
          </p>
          <div className='relative'>
            <p className='absolute inset-y-0 left-2 grid w-8 place-items-center text-sm text-muted-foreground'>
              hive/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='border bg-input pl-10 text-accent-foreground'
            />
          </div>
        </div>

        <div className='flex justify-end gap-4'>
          <Button
            disabled={isLoading}
            onClick={() => router.back()}
            variant='outline'
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
            variant='primary'
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
