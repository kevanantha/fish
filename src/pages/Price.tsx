import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

import { usePriceStore } from '../store/price'
import Form from '../components/Form'

type PriceList = {
  uuid: string
  komoditas: string
  area_provinsi: string
  area_kota: string
  size: string
  price: string
  tgl_parsed: string
  timestamp: string
}

interface PricePayload {
  uuid: string
  komoditas: string
  area_provinsi: string
  area_kota: string
  size: string
  price: string
  tgl_parsed: string
  timestamp: string
}

const options = [
  '10', '20', '30', '40', '50', '60'
]

function Price() {
  // access the client
  const queryClient = useQueryClient()
  const { setFormData, resetFormData, setIsLoadingSubmit, setIsEdit } = usePriceStore()

  const addPriceMutation = useMutation({
    mutationFn: async (price: PricePayload[]) => {
      return await axios.post('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list', price)
    },
    onSettled: () => {
      resetFormData()
      setIsLoadingSubmit(false)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-list'] })
    }
  })

  const deletePriceMutation = useMutation({
    mutationFn: async (uuid: string) => {
      const data = {
        condition: { uuid },
        limit: 1
      }

      return await axios.delete('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list', { data })
    },
    onSettled: () => {
      // resetFormData()
      // setIsLoadingSubmit(false)
      console.log('on settled')
    },
    onSuccess: () => {
      console.log('delete success')
      queryClient.invalidateQueries({ queryKey: ['price-list'] })
    }
  })

  const updatePriceMutation = useMutation({
    mutationFn: async (payload: PricePayload) => {
      const data = {
        condition: { uuid: payload.uuid },
        set: payload,
        limit: 1
      }

      return await axios.put('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list', { data })
    },
    onSettled: () => {
      // resetFormData()
      // setIsLoadingSubmit(false)
      console.log('on settled')
    },
    onSuccess: () => {
      console.log('delete success')
      queryClient.invalidateQueries({ queryKey: ['price-list'] })
    }
  })

  // queries
  const { isLoading, error, data } = useQuery({
    queryKey: ['price-list'],
    queryFn: async (): Promise<PriceList[]> => {
      const { data } = await axios.get('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list')
      return data.filter((d: PriceList) => d.uuid !== null)
    }
  })

  const optionsArea = useQuery({
    queryKey: ['area-options'],
    queryFn: async (): Promise<PriceList[]> => {
      const { data } = await axios.get('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/option_area')
      return data.filter((d: PriceList) => d.uuid !== null)
    }
  })

  const handleDelete = (uuid: string) => () => {
    console.log('handle delete', uuid)
    deletePriceMutation.mutate(uuid)
  }

  // console.log({ isLoading, error, data, isFetching })

  const handleAdd = (payload: PricePayload) => {
    console.log('handle add', payload)
    addPriceMutation.mutate([payload])
  }

  const handleUpdate = (price: PricePayload) => () => {
    console.log('handle update', price)
    setIsEdit(true)
    setFormData(price)
  }

  if (isLoading) return <div>Loading...</div>

  // if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <Form options={options} onFormSubmit={handleAdd} />
      <ol>
        {data?.map((price, index) => (
          <li key={index}>
            <p>
              Komoditas: {price.komoditas}
            </p>
            <p>
              Price: {price.price} - {price.area_provinsi} - {price.area_kota}
            </p>
            <p>
              Size: {price.size}
            </p>
            <p>
              Province: {price.area_provinsi}
            </p>
            <p>
              City: {price.area_kota}
            </p>
            <button onClick={handleDelete(price.uuid)}>Delete</button>
            <button onClick={handleUpdate(price)}>Update</button>
          </li>
        ))}
      </ol>
    </>
  )
}

export default Price
