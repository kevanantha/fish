import React from 'react'
import { UseQueryResult } from '@tanstack/react-query'

import Button from './Button'

import cls from './Form.module.scss'
import { usePriceStore } from '../store/price'

interface PriceState {
  uuid: string
  komoditas: string
  area_provinsi: string
  area_kota: string
  size: string
  price: string
  tgl_parsed: string
  timestamp: string
}

interface FormProps {
  onFormSubmit: (payload: PriceState) => void
  onCancel: () => void
  queryOptionsSize: UseQueryResult<Array<{ size: string }>, unknown>
  queryOptionsProvince: UseQueryResult<Array<{ province: string; city: string }>, unknown>
  queryOptionsCity: UseQueryResult<Array<{ province: string; city: string }>, unknown>
}

const Form = ({ onFormSubmit, queryOptionsSize, queryOptionsProvince, queryOptionsCity, onCancel }: FormProps) => {
  const { formData, setFormData, isLoadingSubmit, setIsLoadingSubmit, isEdit, isLoadingUpdate, setIsLoadingUpdate } =
    usePriceStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleChangeProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target

    setFormData({ ...formData, area_provinsi: value, area_kota: '' })
    queryOptionsCity.refetch()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    isEdit ? setIsLoadingUpdate(true) : setIsLoadingSubmit(true)

    onFormSubmit(formData)
  }

  const checkInput = () => {
    const { uuid, tgl_parsed, timestamp, ...rest } = formData 

    return Object.keys(rest).some((key) => {
      if (formData[key as keyof PriceState] === '') {
        return true
      }
      return false
    })
  }
  const isDisabled = checkInput()

  return (
    <form className={cls.form} onSubmit={handleSubmit}>
      <div className={cls.formGroup}>
        <label htmlFor='komoditas-field'>Komoditas</label>
        <div role='group'>
          <input
            id='komoditas-field'
            name='komoditas'
            className={cls.formControl}
            style={{ width: '95%' }}
            type='text'
            value={formData.komoditas}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={cls.formGroup}>
        <label htmlFor='price-field'>Price</label>
        <input
          id='price-field'
          name='price'
          className={cls.formControl}
          style={{ width: '95%' }}
          type='number'
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      {queryOptionsSize.isLoading ? (
        <div>Loading options size</div>
      ) : (
        <div className={cls.formGroup}>
          <label htmlFor='size-field'>Size</label>
          <select id='size-field' name='size' className={cls.formControl} value={formData.size} onChange={handleChange}>
            <option value='' disabled>
              Select an option
            </option>
            {queryOptionsSize.data?.map(({ size }, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={cls.formGroup}>
        <label htmlFor='province-field'>Province</label>
        <select
          id='province-field'
          name='area_provinsi'
          className={cls.formControl}
          value={formData.area_provinsi}
          onChange={handleChangeProvince}
        >
          <option value='' disabled>
            Select an option
          </option>
          {queryOptionsProvince.data?.map(({ province }, index) => (
            <option key={index} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>

      <div className={cls.formGroup}>
        <label htmlFor='area-field'>Area</label>
        <select
          id='area-field'
          name='area_kota'
          className={cls.formControl}
          value={formData.area_kota}
          disabled={!formData.area_provinsi || queryOptionsCity.isFetching}
          onChange={handleChange}
        >
          <option value='' disabled={queryOptionsCity.isFetching}>
            {queryOptionsCity.isFetching ? 'Fetching options city...' : 'Select an option'}
          </option>
          {queryOptionsCity.data?.map(({ city }, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'end', gap: '8px' }}>
        {isEdit ? (
          <Button type='submit' isDisabled={!!isLoadingUpdate || isDisabled} variant='solid'>
            {isLoadingUpdate ? 'Updating...' : 'Update'}
          </Button>
        ) : (
          <Button type='submit' isDisabled={!!isLoadingSubmit || isDisabled} variant='solid'>
            {isLoadingSubmit ? 'Submitting...' : 'Submit'}
          </Button>
        )}
        <Button type='button' isDisabled={isLoadingSubmit || isLoadingUpdate} variant='outline' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default Form
