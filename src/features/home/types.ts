export type PostKind = 'founder' | 'investor'

export interface Story {
  id: string
  initials: string
  name: string
  chip: string
  headline: string
  gradient: string
}

export interface CommentItem {
  id: string
  name: string
  role: 'Founder' | 'Investor'
  headline: string
  time: string
  initials: string
  content: string
  likes: number
  isReply?: boolean
  replyTo?: string
}

export interface Post {
  id: string
  name: string
  initials: string
  kind: PostKind
  headline: string
  time: string
  body: string
  extra?: string
  tags: string[]
  interested: number
  comments: number
  engagementScore: number
  createdAt: number
  imageUrl?: string
  images?: string[]
  imageName?: string
  banner?: 'deal' | 'celebration'
  reposts?: number
  repostedBy?: string
  quotedPost?: Post
}
