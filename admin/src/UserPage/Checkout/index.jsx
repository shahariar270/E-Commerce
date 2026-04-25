import Input from '@Component/Input'
import { createOrder } from '@Store/slices/orderSlice'
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './styles.scss'
import { getCart } from '@Store/slices/cartSlice'

export const Checkout = () => {
  const dispatch = useDispatch();
  const { items, total_quantity, total_price } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);


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
            <div className="st-checkout--input-field">
              <Input name={'name'} placeholder={'Johnathan Sterling'} label='Full Name' />
              <div className="st-form--group">
                <Input name={'phone'} placeholder={'+880123456789'} label='Phone Number' />
                <Input name={'address'} placeholder={'123 Main Street'} label='Address' />
              </div>
              <div className="st-form--group">
                <Input name={'city'} placeholder={'New York'} label='City' />
                <Input name={'postalCode'} placeholder={'10001'} label='Postal Code' />
              </div>
            </div>
          </div>
          <div className="st-checkout_box">
            <h3>Order Summary</h3>
            <div className="st-checkout_box--summary">

            </div>

          </div>
        </div>
      </div>
    </Formik>
  )
}
