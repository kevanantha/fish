import { create } from 'zustand'

interface PriceFormData {
  uuid: string
  komoditas: string
  area_provinsi: string
  area_kota: string
  size: string
  price: string
  tgl_parsed: string
  timestamp: string
}

interface State {
  formData: PriceFormData
  isLoadingSubmit: boolean
  isEdit: boolean,
  isLoadingUpdate: boolean
  deleteId: string
}

interface Actions {
  setFormData: (data: PriceFormData) => void
  resetFormData: () => void
  setIsLoadingSubmit: (isLoading: boolean) => void
  setIsEdit: (isEdit: boolean) => void
  setIsLoadingUpdate: (isLoading: boolean) => void
  setDeleteId: (id: string) => void
}

const initialState: PriceFormData = {
  uuid: '',
  komoditas: '',
  area_provinsi: '',
  area_kota: '',
  size: '',
  price: '',
  tgl_parsed: '',
  timestamp: '',
}

export const usePriceStore = create<State & Actions>((set) => ({
  formData: initialState,
  setFormData: (data: PriceFormData) => set((state) => ({ formData: { ...state.formData, ...data } })),
  resetFormData: () => set(() => ({ formData: initialState })),
  isLoadingSubmit: false,
  setIsLoadingSubmit: (isLoading: boolean) => set(() => ({ isLoadingSubmit: isLoading })),
  isEdit: false,
  setIsEdit: (isEdit: boolean) => set(() => ({ isEdit })),
  isLoadingUpdate: false,
  setIsLoadingUpdate: (isLoading: boolean) => set(() => ({ isLoadingUpdate: isLoading })),
  deleteId: '',
  setDeleteId: (id: string) => set(() => ({ deleteId: id })),
}))
