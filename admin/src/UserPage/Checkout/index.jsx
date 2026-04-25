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
      className="st-page"
      onSubmit={handleSubmit}
      initialValues
    >
      <div className="st-checkout-field">
        <div className="st-page__header">
          <h2>Checkout</h2>
          <span>Complete your purchase</span>
        </div>
        <div className="st-checkout__form">
          <div className="st-checkout__field">
          <h3>Shipping Information</h3>
            <Input name={'name'} placeholder={'Johnathan Sterling'} label='FULL NAME' />
            <div className="st-form--group">
              <Input name={'name'} placeholder={'Johnathan Sterling'} label='FULL NAME' />
              <Input name={'name'} placeholder={'Johnathan Sterling'} label='FULL NAME' />
            </div>
            <div className="st-form--group">
              <Input name={'name'} placeholder={'Johnathan Sterling'} label='FULL NAME' />
              <Input name={'name'} placeholder={'Johnathan Sterling'} label='FULL NAME' />
            </div>
          </div>
          <div className="st-checkout_box">
dfsadf
          </div>
        </div>
      </div>
    </Formik>
  )
}
