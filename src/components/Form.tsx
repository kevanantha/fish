// import { v4 as uuidv4 } from 'uuid'
import React, { useState } from 'react'
import './Form.scss'
// import { formatToISOString, formatToTimestamp } from '../utils/date'
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
  options: string[]
  onFormSubmit: (payload: PriceState) => void
}

// const generateUUID = (): string => uuidv4()
// const generateTglParsedTimestamp = (): [string, string] => {
//   const date = new Date()
//   return [formatToISOString(date), formatToTimestamp(date)]
// }
// const[tgl_parsed, timestamp] = generateTglParsedTimestamp();

const Form = ({ options, onFormSubmit }: FormProps) => {
  // const [formData, setFormData] = useState<PriceState>({ uuid: generateUUID(), komoditas: '', area_kota: '', area_provinsi: '', size: '', price: '', tgl_parsed, timestamp })
  const { formData, setFormData, isLoadingSubmit, setIsLoadingSubmit, isEdit, isLoadingUpdate, setIsLoadingUpdate } = usePriceStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    isEdit ? setIsLoadingUpdate(true) : setIsLoadingSubmit(true)
    // const [tgl_parsed, timestamp] = generateTglParsedTimestamp()
    // setFormData({ ...formData, uuid: generateUUID(), tgl_parsed, timestamp })
    onFormSubmit(formData)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="komoditas-field">Komoditas</label>
        <input
          id="komoditas-field"
          name="komoditas"
          className="form-control"
          type="text"
          value={formData.komoditas}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price-field">Price</label>
        <input
          id="price-field"
          name="price"
          className="form-control"
          type="text"
          value={formData.price}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="size-field">Size</label>
        <select
          id="size-field"
          name="size"
          className="form-control"
          value={formData.size}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="province-field">Province</label>
        <select
          id="province-field"
          name="area_provinsi"
          className="form-control"
          value={formData.area_provinsi}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select an option
          </option>
          {['BALI', 'DKI JAKARTA'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="area-field">Area</label>
        <select
          id="area-field"
          name="area_kota"
          className="form-control"
          value={formData.area_kota}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select an option
          </option>
          {['BULELENG', 'NUSA PENIDA'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {isEdit ? (
        <button type="submit" disabled={!!isLoadingUpdate} className="btn">
          {isLoadingUpdate ? 'Updating...' : 'Update'}
        </button>
      ) : (
        <button type="submit" disabled={!!isLoadingSubmit} className="btn">
          {isLoadingSubmit ? 'Submitting...' : 'Submit'}
        </button>
      )}
    </form >
  )
}

export default Form

