import HelmetMeta from '../../components/HelmetMeta';
import BrandsHomePage from '../../components/user/Home/BrandsHomePage';
import CategoriesHomePage from '../../components/user/Home/CategoriesHomePage';
import FeaturedProducts from '../../components/user/Home/FeaturedProducts';
import HomeBannerCarousel from '../../components/user/Home/HomeBannerCarousel';

function HomePage() {
  return (
    <div>
      <HelmetMeta title="Home | Gamestop" />

      <HomeBannerCarousel />
      <FeaturedProducts />
      <CategoriesHomePage />
      <BrandsHomePage />
    </div>
  );
}

export default HomePage;
