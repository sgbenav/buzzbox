'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

import { formatTimeToNow } from '@/lib/utils'
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
    <div className='rounded-md bg-card border shadow'>
      <div className='px-6 py-4 flex justify-between'>
        <PostVoteClient
          postId={post.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote?.type}
        />

        <div className='w-0 flex-1'>
          <div className='max-h-40 mt-1 text-xs text-muted-foreground'>
            {hiveName ? (
              <>
                <a
                  className='underline text-accent-foreground text-sm underline-offset-2'
                  href={`/hive/${hiveName}`}>
                  hive/{hiveName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/hive/${hiveName}/post/${post.id}`}>
            <h1 className='text-lg font-semibold py-2 leading-6 text-accent-foreground'>
              {post.title}
            </h1>
          </a>

          <div
            className='relative text-sm max-h-40 w-full overflow-clip'
            ref={pRef}>
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-card to-transparent'/>
            ) : null}
          </div>
        </div>
      </div>

      <div className='bg-muted z-20 text-sm px-4 py-4 sm:px-6'>
        <Link
          href={`/hive/${hiveName}/post/${post.id}`}
          className='w-fit flex items-center gap-2'>
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </Link>
      </div>
    </div>
  )
}
