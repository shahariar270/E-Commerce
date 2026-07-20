import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const CategoryList = ({ categories = [] }) => {
  const navigate = useNavigate();

  return (
    <ul className="eshop-category-list">
      {categories.map((cat) => (
        <li key={cat._id}>
          <button type="button" onClick={() => navigate(`/products?category=${cat._id}`)}>
            {cat.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
