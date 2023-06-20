'use client'

import { startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

import { SubscribeToHivePayload } from '@/lib/validators/hive'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { Button } from '@/components/ui/button'

import { useToast } from '../hooks/use-toast'

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean
  hiveId: string
  hiveName: string
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  hiveId,
  hiveName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast()
  const { loginToast } = useCustomToasts()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToHivePayload = {
        hiveId,
      }

      const { data } = await axios.post('/api/hive/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast({
        title: 'Subscribed!',
        description: `You are now subscribed to hive/${hiveName}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToHivePayload = {
        hiveId,
      }

      const { data } = await axios.post('/api/hive/unsubscribe', payload)
      return data as string
    },
    onError: (err: AxiosError) => {
      toast({
        title: 'Error',
        description: err.response?.data as string,
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast({
        title: 'Unsubscribed!',
        description: `You are now unsubscribed from/${hiveName}`,
      })
    },
  })

  return isSubscribed ? (
    <Button
      className='mb-4 mt-1 w-full'
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className='mb-4 mt-1 w-full'
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  )
}

export default SubscribeLeaveToggle
