import { create } from 'zustand'

interface State {
  page: number
  totalPage: number
}

interface Actions {
  setPage: (page: number) => void
  prevPage: () => void
  nextPage: () => void
  setTotalPage: (totalPage: number) => void
}

export const usePaginationStore = create<State & Actions>((set) => ({
  page: 1,
  setPage: (page: number) => set(() => ({ page })),
  prevPage: () => set((state) => ({ page: state.page - 1 })),
  nextPage: () => set((state) => ({ page: state.page + 1 })),
  totalPage: 1,
  setTotalPage: (totalPage: number) => set(() => ({ totalPage })),
}))
