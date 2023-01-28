import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

import { formatToISOString, formatToTimestamp } from '../utils/date'

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

interface PriceState {
  formData: PriceFormData
  setFormData: (data: PriceFormData) => void
  resetFormData: () => void
  isLoadingSubmit: boolean
  setIsLoadingSubmit: (isLoading: boolean) => void
  isEdit: boolean,
  setIsEdit: (isEdit: boolean) => void
  isLoadingUpdate: boolean
  setIsLoadingUpdate: (isLoading: boolean) => void
}

const generateUUID = (): string => uuidv4()
const generateTglParsedTimestamp = (): [string, string] => {
  const date = new Date()
  return [formatToISOString(date), formatToTimestamp(date)]
}
const [tgl_parsed, timestamp] = generateTglParsedTimestamp();

const initialState: PriceFormData = {
  uuid: generateUUID(),
  komoditas: '',
  area_provinsi: '',
  area_kota: '',
  size: '',
  price: '',
  tgl_parsed,
  timestamp,
}

export const usePriceStore = create<PriceState>((set) => ({
  formData: initialState,
  setFormData: (data: PriceFormData) => set((state) => ({ formData: { ...state.formData, ...data } })),
  resetFormData: () => set(() => ({ formData: initialState })),
  isLoadingSubmit: false,
  setIsLoadingSubmit: (isLoading: boolean) => set(() => ({ isLoadingSubmit: isLoading })),
  isEdit: false,
  setIsEdit: (isEdit: boolean) => set(() => ({ isEdit })),
  isLoadingUpdate: false,
  setIsLoadingUpdate: (isLoading: boolean) => set(() => ({ isLoadingUpdate: isLoading })),
}))
