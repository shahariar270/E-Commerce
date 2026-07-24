import { useNavigate } from 'react-router-dom';
import SEO from '@Component/SEO';
import './styles.scss';

const sections = [
  {
    heading: '1. Accepting These Terms',
    body: 'By creating an account or placing an order on this site, you agree to these Terms of Use. If you do not agree, please do not use the store.',
  },
  {
    heading: '2. Your Account',
    body: 'You are responsible for keeping your login details secure and for all activity that happens under your account. Let us know right away if you suspect unauthorized use.',
  },
  {
    heading: '3. Orders & Pricing',
    body: 'All product prices and availability are subject to change without notice. We reserve the right to cancel or refuse any order, for example due to pricing errors or stock issues.',
  },
  {
    heading: '4. Payments',
    body: 'Payment is required at the time of ordering. By submitting payment details, you confirm you are authorized to use the chosen payment method.',
  },
  {
    heading: '5. Shipping & Returns',
    body: 'Delivery times are estimates and not guaranteed. Please refer to our return policy, or contact support, if an item arrives damaged or incorrect.',
  },
  {
    heading: '6. Prohibited Use',
    body: 'You agree not to misuse the site — including attempting to access other users’ accounts, disrupting the service, or submitting fraudulent orders.',
  },
  {
    heading: '7. Changes to These Terms',
    body: 'We may update these terms occasionally. Continuing to use the site after changes are posted means you accept the updated terms.',
  },
  {
    heading: '8. Contact Us',
    body: 'Questions about these terms? Reach out at help@ecommerce.example.',
  },
];

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="static-page">
      <SEO title="Terms Of Use" description="The terms and conditions for using our store." noindex />
      <div className="eshop-container">
        <div className="static-page__breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> / <span className="is-current">Terms Of Use</span>
        </div>

        <h1 className="static-page__title">Terms Of Use</h1>
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

export default TermsOfUse;
