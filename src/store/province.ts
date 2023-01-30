import { create } from 'zustand'

type TProvinces = Array<{ province: string }>

interface State {
  provinces: TProvinces
}

interface Actions {
  setProvinces: (provinces: TProvinces) => void
}

export const useProvinceStore = create<State & Actions>((set) => ({
  provinces: [],
  setProvinces: (provinces: TProvinces) => set(() => ({ provinces: provinces })),
}))
