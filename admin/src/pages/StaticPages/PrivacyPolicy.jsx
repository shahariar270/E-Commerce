import { useNavigate } from 'react-router-dom';
import SEO from '@Component/SEO';
import './styles.scss';

const sections = [
  {
    heading: '1. Information We Collect',
    body: 'When you create an account, place an order, or subscribe to our newsletter, we collect information such as your name, email address, phone number, and shipping address. We also collect basic usage data (like pages visited) to help us improve the store.',
  },
  {
    heading: '2. How We Use Your Information',
    body: 'We use your information to process orders, send order and shipping updates, respond to support requests, and — if you opt in — send newsletters and promotional offers. We never sell your personal information to third parties.',
  },
  {
    heading: '3. Payment Information',
    body: 'Payment details are processed securely and are not stored on our servers.',
  },
  {
    heading: '4. Cookies',
    body: 'We use cookies to keep you signed in, remember your cart, and understand how the store is used. You can disable cookies in your browser, but some features may not work correctly.',
  },
  {
    heading: '5. Sharing Your Information',
    body: 'We share information only with service providers who help us run the store (such as payment processors and delivery partners), and only to the extent needed to provide their service.',
  },
  {
    heading: '6. Your Rights',
    body: 'You can review, update, or delete your account information at any time from your profile, or by contacting us directly.',
  },
  {
    heading: '7. Contact Us',
    body: 'If you have questions about this policy, reach out at help@ecommerce.example.',
  },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="static-page">
      <SEO title="Privacy Policy" description="How we collect, use, and protect your information." noindex />
      <div className="eshop-container">
        <div className="static-page__breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> / <span className="is-current">Privacy Policy</span>
        </div>

        <h1 className="static-page__title">Privacy Policy</h1>
        <p className="static-page__updated">Last updated: July 24, 2026</p>

        {sections.map((section) => (
          <div className="static-page__section" key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
