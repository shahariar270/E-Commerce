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
import { apiClient } from '@utils/api'
import { checkoutSchema } from '@utils/validationSchemas'

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total_quantity, total_price, coupon, grand_total } = useSelector((state) => state.cart);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [confirmation, setConfirmation] = useState(null);

  // Guest-only email verification (logged-in users' account email is
  // already trusted — see order_controller.create_order on the backend,
  // which enforces the same rule so this can't be bypassed client-side).
  const [codeSentEmail, setCodeSentEmail] = useState(null);
  const [verifiedEmail, setVerifiedEmail] = useState(null);
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifyMessageType, setVerifyMessageType] = useState('info');

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleSendCode = async (email) => {
    setSendingCode(true);
    setVerifyMessage('');
    try {
      const res = await apiClient('/email/send-code', { method: 'POST', body: JSON.stringify({ email }) });
      setCodeSentEmail(email);
      setVerifyCodeInput('');
      setVerifyMessageType('success');
      setVerifyMessage(res?.message || 'Code sent — check your inbox.');
    } catch (err) {
      setVerifyMessageType('error');
      setVerifyMessage(err.message || 'Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (email) => {
    setVerifying(true);
    setVerifyMessage('');
    try {
      await apiClient('/email/verify-code', { method: 'POST', body: JSON.stringify({ email, code: verifyCodeInput }) });
      setVerifiedEmail(email);
      setVerifyMessage('');
    } catch (err) {
      setVerifyMessageType('error');
      setVerifyMessage(err.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

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
      validationSchema={checkoutSchema}
    >
      {({ values, isSubmitting }) => {
        const requiresEmailVerification = !isAuthenticated;
        const isEmailVerified = requiresEmailVerification
          ? verifiedEmail && verifiedEmail === values.email
          : true;
        const hasCodeSentForThisEmail = codeSentEmail && codeSentEmail === values.email;
        const canSendCode = !!values.email && !sendingCode;

        return (
          <div className="eshop-container st-checkout">
            <SEO title="Checkout" description="Complete your purchase securely." noindex />
            <h1 className="st-checkout__title">Checkout</h1>
            <Form className="st-checkout__form">
              <div className="st-checkout__field">
                <h3>Contact Information</h3>
                <div className="st-checkout--input-field">
                  <Input
                    name={'email'}
                    type={'email'}
                    placeholder={'you@example.com'}
                    label='Email Address'
                    required
                    rightElement={
                      requiresEmailVerification && !hasCodeSentForThisEmail ? (
                        isEmailVerified ? (
                          <span className="st-checkout__verify-status st-checkout__verify-status--ok">✓ Verified</span>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            label={sendingCode ? 'Sending...' : 'Send Verification Code'}
                            disabled={!canSendCode}
                            onClick={() => handleSendCode(values.email)}
                          />
                        )
                      ) : null
                    }
                  />

                  {requiresEmailVerification && !hasCodeSentForThisEmail && verifyMessage && (
                    <p className={`st-checkout__verify-message st-checkout__verify-message--${verifyMessageType}`}>{verifyMessage}</p>
                  )}

                  {requiresEmailVerification && !isEmailVerified && hasCodeSentForThisEmail && (
                    <div className="st-checkout__verify">
                      <p className="st-checkout__verify-label">
                        Enter the 6-digit code sent to <strong>{values.email}</strong>
                      </p>
                      <div className="st-checkout__verify-code">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoFocus
                          className="st-checkout__verify-input"
                          placeholder="000000"
                          value={verifyCodeInput}
                          onChange={(e) => setVerifyCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          label={verifying ? 'Verifying...' : 'Verify'}
                          disabled={verifying || verifyCodeInput.length !== 6}
                          onClick={() => handleVerifyCode(values.email)}
                        />
                      </div>
                      <div className="st-checkout__verify-footer">
                        {verifyMessage && (
                          <p className={`st-checkout__verify-message st-checkout__verify-message--${verifyMessageType}`}>
                            {verifyMessage}
                          </p>
                        )}
                        <button
                          type="button"
                          className="st-checkout__verify-resend"
                          disabled={sendingCode}
                          onClick={() => handleSendCode(values.email)}
                        >
                          {sendingCode ? 'Resending...' : 'Resend code'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="st-checkout__field">
                <h3>Shipping Information</h3>
                <div className="st-checkout--input-field">
                  <Input name={'shippingAddress.name'} placeholder={'Johnathan Sterling'} label='Full Name' required />
                  <Input name={'shippingAddress.phone'} type="tel" placeholder={'01712345678'} label='Phone Number' required />
                  <Input name={'shippingAddress.address'} as="textarea" placeholder={'House, road, area, thana/upazila'} label='Address' required />
                  <div className="st-form--group">
                    <Input name={'shippingAddress.city'} placeholder={'Dhaka'} label='City' required />
                    <Input name={'shippingAddress.postalCode'} placeholder={'1207'} label='Postal Code' required />
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
                    label={requiresEmailVerification && !isEmailVerified ? 'Verify Email to Continue' : 'Complete Purchase'}
                    variant="primary"
                    type='submit'
                    disabled={!items?.length || isSubmitting || !isEmailVerified}
                    size='lg'
                  />
                </div>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  )
}
