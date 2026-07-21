import Input from '@Component/Input'
import { createOrder } from '@Store/slices/orderSlice'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './styles.scss'
import { getCart, clearCart } from '@Store/slices/cartSlice'
import Button from '@Component/Buttons'
import SEO from '@Component/SEO'
import { useNavigate } from 'react-router-dom'

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total_quantity, total_price, coupon, grand_total } = useSelector((state) => state.cart);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);


  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(createOrder(values))
      .unwrap()
      .then((res) => {
        setConfirmation(res.data);
        dispatch(clearCart());
      })
      .catch(() => { })
      .finally(() => setSubmitting(false));
  }

  const initialValues = {
    email: '',
    shippingAddress: {
      name: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
    }
  }

  if (confirmation) {
    return (
      <div className="eshop-container st-checkout st-checkout--confirmation">
        <h1 className="st-checkout__title">Thank you for your order! 🎉</h1>
        <p>
          Order <strong>#{confirmation.orderId?.slice(-6).toUpperCase()}</strong> has been placed
          successfully — total <strong>${confirmation.total?.toFixed(2)}</strong>.
        </p>
        <p>A confirmation email is on its way to your inbox.</p>
        <Button label="Continue Shopping" variant="primary" onClick={() => navigate('/products')} />
      </div>
    );
  }

  return (
    <Formik
      className="st-page--checkout"
      onSubmit={handleSubmit}
      initialValues={initialValues}
    >
      <div className="eshop-container st-checkout">
        <SEO title="Checkout" description="Complete your purchase securely." noindex />
        <h1 className="st-checkout__title">Checkout</h1>
        <Form className="st-checkout__form">
          <div className="st-checkout__field">
            <h3>Contact Information</h3>
            <div className="st-checkout--input-field">
              <Input name={'email'} type={'email'} placeholder={'you@example.com'} label='Email Address' required />
            </div>
          </div>
          <div className="st-checkout__field">
            <h3>Shipping Information</h3>
            <div className="st-checkout--input-field">
              <Input name={'shippingAddress.name'} placeholder={'Johnathan Sterling'} label='Full Name' />
              <div className="st-form--group">
                <Input name={'shippingAddress.phone'} placeholder={'+880123456789'} label='Phone Number' />
                <Input name={'shippingAddress.address'} placeholder={'123 Main Street'} label='Address' />
              </div>
              <div className="st-form--group">
                <Input name={'shippingAddress.city'} placeholder={'New York'} label='City' />
                <Input name={'shippingAddress.postalCode'} placeholder={'10001'} label='Postal Code' />
              </div>
            </div>
          </div>
          <div className="st-checkout_box">
            <h3>Order Summary</h3>
            <div className="st-checkout_box--summary">
              {items.map((item, index) => (
                <div className="st-cart__item" key={item.product_id?._id}>
                  <div className="st-cart__image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="st-cart__placeholder" />
                    )}
                  </div>

                  <div className="st-cart__details">
                    <h4>{item.name}</h4>
                    <div className="st-cart__actions">
                      <span>Quantity: {item.quantity}</span>
                      <span className="st-cart__price">
                        ${item.subtotal?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="st-checkout_box--total">
              <div className="st-cart__summary-row">
                <span>Items:</span>
                <span>{total_quantity}</span>
              </div>
              <div className="st-cart__summary-row">
                <span>Subtotal:</span>
                <span>${total_price?.toFixed(2)}</span>
              </div>
              {coupon?.code && (
                <div className="st-cart__summary-row st-cart__summary-discount">
                  <span>Discount ({coupon.code}):</span>
                  <span>-${coupon.discount_amount?.toFixed(2)}</span>
                </div>
              )}
              <div className="st-cart__summary-row st-cart__summary-total">
                <span>Total:</span>
                <strong>${(grand_total ?? total_price)?.toFixed(2)}</strong>
              </div>
            </div>
            <div className="st-checkout--button">
              <Button
                label="Complete Purchase"
                variant="primary"
                type='submit'
                disabled={!items?.length}
                size='lg'
              />
            </div>
          </div>
        </Form>
      </div>
    </Formik>
  )
}
