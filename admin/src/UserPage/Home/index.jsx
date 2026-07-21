import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '@Store/slices/productSlice';
import { getCategories } from '@Store/slices/categorySlice';
import ProductCard from '@Component/ProductCard';
import SectionHeading from '@Component/Storefront/SectionHeading';
import CategoryList from '@Component/Storefront/CategoryList';
import PromoBanner from '@Component/Storefront/PromoBanner';
import SEO from '@Component/SEO';
import heroImage from '../../assets/images/eshop/hero-slide-1.png';
import featureGame from '../../assets/images/eshop/feature-game.png';
import featureGucci from '../../assets/images/eshop/feature-gucci.png';
import featureHat from '../../assets/images/eshop/feature-hat.png';
import featureSpeaker from '../../assets/images/eshop/feature-speaker.png';
import './styles.scss';

const featured = [
  [featureGame, 'Gaming Console'],
  [featureGucci, 'Designer Bag'],
  [featureHat, 'Classic Hat'],
  [featureSpeaker, 'Bluetooth Speaker'],
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: products, loading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProducts({ per_page: 8 }));
    }
    if (!categories || categories.length === 0) {
      dispatch(getCategories({ page: 1, limit: 20 }));
    }
  }, [dispatch]);

  return (
    <div className="eshop-home">
      <SEO
        title="Home"
        description="Launch and manage your online store with the best ecommerce CMS. A complete bangladeshi ecommerce solution built to grow your bangladeshi ecommerce business."
        keywords={[
          "best ecommerce CMS Bangladesh",
          "bangladeshi ecommerce platform",
          "start ecommerce business Bangladesh",
        ]}
        type="website"
      />
      <div className="eshop-container eshop-home__hero-row">
        <div className="eshop-home__categories">
          <CategoryList categories={categories} />
        </div>
        <div className="eshop-home__hero">
          <img src={heroImage} alt="Shop the latest deals" />
        </div>
      </div>

      <div className="eshop-container eshop-home__section">
        <SectionHeading eyebrow="Our Products" title="Explore Our Products" />
        {loading ? (
          <p className="eshop-home__status">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="eshop-home__status">No products available yet.</p>
        ) : (
          <div className="eshop-home__grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div className="eshop-home__view-all">
          <button type="button" onClick={() => navigate('/products')}>View All Products</button>
        </div>
      </div>

      <PromoBanner
        eyebrow="Categories"
        title="Enhance Your Shopping Experience"
        subtitle="Discover deals across every category, curated just for you."
        ctaLabel="Shop Now"
        onCta={() => navigate('/products')}
      />

      <div className="eshop-container eshop-home__section">
        <SectionHeading eyebrow="Featured" title="New Arrival" />
        <div className="eshop-home__feature-grid">
          {featured.map(([img, name]) => (
            <div key={name} className="eshop-home__feature-tile" onClick={() => navigate('/products')}>
              <img src={img} alt={name} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
