import type { Post, Hive, User, Vote, Comment } from '@prisma/client'

export type ExtendedPost = Post & {
  hive: Hive
  votes: Vote[]
  author: User
  comments: Comment[]
}