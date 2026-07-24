import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '@Component/SEO';
import './styles.scss';

const faqs = [
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you can view its status anytime from the Orders page in your account.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept major cards and other checkout options shown at checkout. All payments are processed securely.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery times vary by location, but most orders arrive within 3–7 business days.',
  },
  {
    question: 'Can I return or exchange an item?',
    answer: 'Yes — contact our support team within 7 days of delivery and we\'ll walk you through the return process.',
  },
  {
    question: 'Do I need an account to place an order?',
    answer: 'No, you can check out as a guest. Creating an account just lets you track orders and save your details for next time.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Email us at help@ecommerce.example and we\'ll get back to you as soon as possible.',
  },
];

const FAQ = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="static-page">
      <SEO title="FAQ" description="Answers to common questions about ordering, shipping, and returns." noindex />
      <div className="eshop-container">
        <div className="static-page__breadcrumb">
          <span onClick={() => navigate('/')}>Home</span> / <span className="is-current">FAQ</span>
        </div>

        <h1 className="static-page__title">Frequently Asked Questions</h1>
        <p className="static-page__updated">Can't find your answer? Email help@ecommerce.example</p>

        <div className="static-page__faq-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div className="static-page__faq-item" key={item.question}>
                <button
                  type="button"
                  className="static-page__faq-question"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <span className="static-page__faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="static-page__faq-answer">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
