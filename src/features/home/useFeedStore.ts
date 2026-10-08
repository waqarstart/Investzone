import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { posts as initialPosts } from './data'
import type { CommentItem, Post } from './types'

interface FeedState {
  posts: Post[]
  hiddenIds: string[]
  commentsMap: Record<string, CommentItem[]>
  addPost: (post: Post) => void
  updatePost: (post: Post) => void
  deletePost: (id: string) => void
  hidePost: (id: string) => void
  unhidePost: (id: string) => void
  addComment: (postId: string, comment: CommentItem) => void
  deleteComment: (postId: string, commentId: string) => void
  setPostComments: (postId: string, comments: CommentItem[]) => void
  resetFeed: () => void
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      hiddenIds: [],
      commentsMap: {},
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),
      updatePost: (updated) =>
        set((state) => ({
          posts: state.posts.map((p) => (p.id === updated.id ? updated : p)),
        })),
      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),
      hidePost: (id) =>
        set((state) => ({
          hiddenIds: state.hiddenIds.includes(id) ? state.hiddenIds : [...state.hiddenIds, id],
        })),
      unhidePost: (id) =>
        set((state) => ({
          hiddenIds: state.hiddenIds.filter((hiddenId) => hiddenId !== id),
        })),
      addComment: (postId, comment) =>
        set((state) => {
          const currentComments = state.commentsMap[postId] || []
          return {
            commentsMap: {
              ...state.commentsMap,
              [postId]: [comment, ...currentComments],
            },
            posts: state.posts.map((p) =>
              p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p
            ),
          }
        }),
      deleteComment: (postId, commentId) =>
        set((state) => {
          const currentComments = state.commentsMap[postId] || []
          return {
            commentsMap: {
              ...state.commentsMap,
              [postId]: currentComments.filter((c) => c.id !== commentId),
            },
            posts: state.posts.map((p) =>
              p.id === postId ? { ...p, comments: Math.max(0, (p.comments || 1) - 1) } : p
            ),
          }
        }),
      setPostComments: (postId, comments) =>
        set((state) => ({
          commentsMap: {
            ...state.commentsMap,
            [postId]: comments,
          },
        })),
      resetFeed: () =>
        set({
          posts: initialPosts,
          hiddenIds: [],
          commentsMap: {},
        }),
    }),
    {
      name: 'bridgeway-feed',
    }
  )
)
