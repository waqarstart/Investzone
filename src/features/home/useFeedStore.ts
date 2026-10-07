import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { posts as initialPosts } from './data'
import type { Post } from './types'

interface FeedState {
  posts: Post[]
  hiddenIds: string[]
  addPost: (post: Post) => void
  updatePost: (post: Post) => void
  deletePost: (id: string) => void
  hidePost: (id: string) => void
  unhidePost: (id: string) => void
  incrementCommentCount: (postId: string) => void
  resetFeed: () => void
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      hiddenIds: [],
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
      incrementCommentCount: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p
          ),
        })),
      resetFeed: () =>
        set({
          posts: initialPosts,
          hiddenIds: [],
        }),
    }),
    {
      name: 'bridgeway-feed',
    }
  )
)
