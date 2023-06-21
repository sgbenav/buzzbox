'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

import { formatTimeToNow } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import EditorOutput from '@/components/editor/editor-output'

import { Post, User, Vote } from '@prisma/client'
import PostVoteClient from './post-vote-client'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  post: Post & {
    author: User
    votes: Vote[]
  }
  votesAmt: number
  hiveName: string
  currentVote?: PartialVote
  commentAmt: number
}

export default function Post({
  post,
  votesAmt,
  hiveName,
  currentVote,
  commentAmt,
}: PostProps) {
  const pRef = useRef<HTMLParagraphElement>(null)

  return (
    <Card className='overflow-hidden'>
              <PostVoteClient
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote?.type}
        />
      <CardHeader className='space-y-1 text-sm px-10'>
        <div>
          {hiveName ? (
            <>
              <a
                className='text-sm text-muted-foreground underline underline-offset-2'
                href={`/hive/${hiveName}`}
              >
                hive/{hiveName}
              </a>
              <span className='px-1'>•</span>
            </>
          ) : null}
          <span>Posted by u/{post.author.username}</span>{' '}
          {formatTimeToNow(new Date(post.createdAt))}
        </div>
      </CardHeader>
      <CardContent className='w-full p-0'>
        <a href={`/hive/${hiveName}/post/${post.id}`}>
          <h1 className='px-10 py-2 text-lg font-semibold leading-6'>
            {post.title}
          </h1>
        </a>
        <div
          className='relative max-h-40 w-full overflow-clip text-sm'
          ref={pRef}
        >
          <div className='px-10 pb-4'>
            <EditorOutput content={post.content} />
          </div>

          {pRef.current?.clientHeight === 160 ? (
            // blur bottom if content is too long
            <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-muted/50 to-transparent'></div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className='bg-muted py-4 px-12 text-sm'>
        <Link
          href={`/hive/${hiveName}/post/${post.id}`}
          className='flex w-fit items-center gap-2'
        >
          <MessageSquare className='h-4 w-4' />{' '}
          {commentAmt} comments
        </Link>
      </CardFooter>
    </Card>
  )
}
