import React from 'react';
import './styles.scss';

const PromoBanner = ({ eyebrow, title, subtitle, ctaLabel, onCta }) => (
  <div className="eshop-promo-banner">
    <div>
      <p className="eshop-promo-banner__eyebrow">{eyebrow}</p>
      <h1 className="eshop-promo-banner__title">{title}</h1>
      {subtitle && <p className="eshop-promo-banner__subtitle">{subtitle}</p>}
      {ctaLabel && (
        <button type="button" className="eshop-promo-banner__cta" onClick={onCta}>
          {ctaLabel}
        </button>
      )}
    </div>
  </div>
);

export default PromoBanner;
