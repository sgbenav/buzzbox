'use client'

import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

import { CommentRequest } from '@/lib/validators/comment'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CreateCommentProps {
  postId: string
  replyToId?: string
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const { loginToast } = useCustomToasts()

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = { postId, text, replyToId }

      const { data } = await axios.patch(
        `/api/hive/post/comment/`,
        payload
      )
      return data
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      router.refresh()
      setInput('')
    },
  })

  return (
    <div className='grid w-full gap-2 '>
      <Label htmlFor='comment'>Your comment</Label>
      <div className='mt-2'>
        <Textarea
          id='comment'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder='What are your thoughts?'
          className='bg-muted'
        />

        <div className='mt-4 flex justify-end'>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
            variant="secondary"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateComment
