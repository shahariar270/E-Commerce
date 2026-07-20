import React from 'react';
import './styles.scss';

const SectionHeading = ({ eyebrow, title }) => (
  <div className="eshop-section-heading">
    <div className="eshop-section-heading__eyebrow">
      <div className="eshop-section-heading__bar" />
      <span className="eshop-section-heading__eyebrow-text">{eyebrow}</span>
    </div>
    <h2 className="eshop-section-heading__title">{title}</h2>
  </div>
);

export default SectionHeading;
