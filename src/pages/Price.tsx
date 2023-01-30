import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { usePriceStore } from '../store/price'
import { useProvinceStore } from '../store/province'
import { usePaginationStore } from '../store/pagination'

import Button from '../components/Button'
import Form from '../components/Form'
import Table from '../components/Table'
import SearchInput from '../components/SearchInput'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'

type OptionsArea = Array<{ province: string; city: string }>

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

const Price = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = React.useState(false)
  const {
    formData,
    setFormData,
    resetFormData,
    setIsLoadingSubmit,
    isEdit,
    setIsEdit,
    isLoadingUpdate,
    setIsLoadingUpdate,
    deleteId,
    setDeleteId,
  } = usePriceStore()
  const { setProvinces } = useProvinceStore()
  const { page, setTotalPage } = usePaginationStore()
  const headers = [
    {
      key: 'komoditas',
      label: 'Komoditas',
    },
    {
      key: 'size',
      label: 'Size',
    },
    {
      key: 'price',
      label: 'Price',
    },
    {
      key: 'area_provinsi',
      label: 'Province',
    },
    {
      key: 'area_kota',
      label: 'City',
    },
    {
      key: 'tgl_parsed',
      label: 'Created at',
    },
    {
      key: 'action',
      label: 'Action',
    },
  ]

  const addPriceMutation = useMutation({
    mutationFn: async (price: PricePayload[]) => {
      return await axios.post(
        'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list',
        price,
      )
    },
    onSettled: () => {
      resetFormData()
      setIsLoadingSubmit(false)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-list'] })
    },
  })

  const deletePriceMutation = useMutation({
    mutationFn: async (uuid: string) => {
      const data = {
        condition: { uuid },
        limit: 1,
      }

      return await axios.delete(
        'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list',
        { data },
      )
    },
    onSettled: () => {
      resetFormData()
      setIsLoadingSubmit(false)
      console.log('on settled')
    },
    onSuccess: () => {
      console.log('delete success')
      queryClient.invalidateQueries({ queryKey: ['price-list'] })
    },
  })

  const updatePriceMutation = useMutation({
    mutationFn: async (payload: PricePayload) => {
      const data = {
        condition: { uuid: payload.uuid },
        set: payload,
        limit: 1,
      }

      return await axios.put(
        'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list',
        { ...data },
      )
    },
    onSettled: () => {
      // resetFormData()
      // setIsLoadingSubmit(false)
      setIsEdit(false)
      setIsLoadingUpdate(false)
      resetFormData()
      console.log('on settled')
    },
    onSuccess: () => {
      console.log('update success')
      queryClient.invalidateQueries({ queryKey: ['price-list'] })
    },
  })

  // queries
  const queryPriceList = useQuery({
    queryKey: ['price-list'],
    queryFn: async (): Promise<PriceList[]> => {
      /** NOTE(kevan): basically, it's for pagination but since the API is messy (a lot of null value and cannot delete it with 'condition uuid: null')
       * so I just paginate in client side
       */
      // const { data } = await axios.get('https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list', { params: { limit: 10, offset: page } })

      const { data } = await axios.get(
        'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list',
      )
      return data
    },
    select: (data: PriceList[]) => {
      // NOTE(kevan): to filter uuid that is null and sort ascendingly
      const firstIndex = page === 1 ? 0 : page * 10
      const lastIndex = firstIndex + 10
      const filteredNull = data.filter((d: PriceList) => d.uuid !== null)

      // setTotalPage(Math.floor(filteredNull.length / 10))

      return filteredNull
        .sort((a: PriceList, b: PriceList) => {
          return +a.timestamp - +b.timestamp
        })
        .slice(firstIndex, lastIndex)
    },
  })

  React.useEffect(() => {
    if (queryPriceList.status === 'success') {
      setTotalPage(Math.floor(queryPriceList.data.length / 10))
    }
  }, [queryPriceList.status, queryPriceList.data, setTotalPage])

  const queryOptionsProvince = useQuery({
    queryKey: ['provinces'],
    queryFn: async (): Promise<OptionsArea> => {
      const { data } = await axios.get(
        'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/option_area',
      )
      return data
    },
    select: (data: OptionsArea) => {
      // NOTE(kevan): to filter province and city that is empty
      const seen = new Set<string>()
      const result = data.filter(
        ({ province, city }: { province: string; city: string }) => {
          if (!!province && !!city) {
            if (seen.has(province)) return false

            seen.add(province)
            return true
          }
          return false
        },
      )
      return result
    },
  })

  const queryOptionsCity = useQuery({
    queryKey: ['cities', formData.area_provinsi],
    queryFn: async ({ queryKey }): Promise<OptionsArea> => {
      const [, area_provinsi] = queryKey
      const { data } = await axios.get(
        'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/option_area',
        { params: { search: `{"province": "${area_provinsi}"}` } },
      )
      return data
    },
    select: (data: OptionsArea) => {
      // NOTE(kevan): to filter province and city that is empty
      const seen = new Set<string>()
      const result = data.filter(
        ({ province, city }: { province: string; city: string }) => {
          if (!!province && !!city) {
            if (seen.has(province)) return false

            seen.add(province)
            return true
          }
          return false
        },
      )
      return result
    },
    enabled: !!formData.area_provinsi,
    keepPreviousData: true,
  })

  const queryOptionsSize = useQuery({
    queryKey: ['sizes'],
    queryFn: async (): Promise<Array<{ size: string }>> => {
      const { data } = await axios.get(
        'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/option_size',
      )
      return data
    },
    select: (data: Array<{ size: string }>) => {
      const seen = new Set<string>()
      return data
        .filter(({ size }: { size: string }) => {
          if (seen.has(size)) return false

          seen.add(size)
          return true
        })
        .sort((a: { size: string }, b: { size: string }) => {
          return +a.size - +b.size
        })
    },
  })

  const handleDelete = (uuid: string) => () => {
    console.log('handle delete', uuid)
    setDeleteId(uuid)
    setIsModalDeleteOpen(true)
    // deletePriceMutation.mutate(uuid)
  }

  const handleDeleteConfirm = async () => {
    await deletePriceMutation.mutateAsync(deleteId)
    setIsModalDeleteOpen(false)
  }

  const handleSubmit = async (payload: PricePayload) => {
    console.log('handle add', payload)
    if (isEdit) {
      await updatePriceMutation.mutateAsync(payload)
      setIsEdit(false)
      setIsLoadingUpdate(false)
    } else {
      await addPriceMutation.mutateAsync([payload])
      setIsLoadingSubmit(false)
    }

    resetFormData()
    setIsModalOpen(false)
  }

  const handleUpdate = (price: PricePayload) => () => {
    console.log('handle update', price)

    setIsEdit(true)
    setFormData(price)
    setIsModalOpen(true)
  }

  if (queryPriceList.isLoading) return <div>Loading...</div>

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

      {/* <SearchInput /> */}
      <div style={{ width: '200px' }}>
        <Pagination page={page} />
      </div>

      {/* @ts-ignore */}
      <Table
        headers={headers}
        data={queryPriceList.data}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        title={isEdit ? 'Edit data' : 'Add data'}
        onClose={() => setIsModalOpen(false)}
      >
        <Form
          queryOptionsSize={queryOptionsSize}
          queryOptionsProvince={queryOptionsProvince}
          queryOptionsCity={queryOptionsCity}
          onFormSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            resetFormData()
            setIsEdit(false)
          }}
        />
      </Modal>

      <Modal
        isOpen={isModalDeleteOpen}
        title='Delete data?'
        onClose={() => setIsModalDeleteOpen(false)}
      >
        <div>
          <p>This price data will be deleted.</p>

          <div style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
            <Button
              type='submit'
              isDisabled={deletePriceMutation.isLoading}
              variant='solid'
              onClick={handleDeleteConfirm}
            >
              {deletePriceMutation.isLoading ? 'Deleting...' : 'Delete'}
            </Button>

            <Button
              type='button'
              variant='outline'
              onClick={() => setIsModalDeleteOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Price

