import Input from '@Component/Input'
import { createOrder } from '@Store/slices/orderSlice'
import { Formik } from 'formik'
import React from 'react'
import { useDispatch } from 'react-redux'
import './styles.scss'

export const Checkout = () => {
  const dispatch = useDispatch();

  const handleSubmit = (values, action) => {
    dispatch(createOrder(values)).then(() => { })
  }

  const initialValues = {
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  }

  return (
    <Formik
      className="st-page--checkout"
      onSubmit={handleSubmit}
      initialValues={initialValues}
    >
      <div className="st-layout__content">
        <div className="st-page__header">
          <h2>Checkout</h2>
          <span>Complete your purchase</span>
        </div>
        <div className="st-checkout__form">
          <div className="st-checkout__field">
            <h3>Shipping Information</h3>
            <Input name={'name'} placeholder={'Johnathan Sterling'} label='FULL NAME' />
            <div className="st-form--group">
              <Input name={'phone'} placeholder={'+880123456789'} label='PHONE NUMBER' />
              <Input name={'address'} placeholder={'123 Main Street'} label='ADDRESS' />
            </div>
            <div className="st-form--group">
              <Input name={'city'} placeholder={'New York'} label='CITY' />
              <Input name={'postalCode'} placeholder={'10001'} label='POSTAL CODE' />
            </div>
          </div>
          <div className="st-checkout_box">
            dskfja sdjf
          </div>
        </div>
      </div>
    </Formik>
  )
}
