import ProductList from '@/components/shared/product/product-list';
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions';
import { ProductCarousel } from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBoxes from '@/components/icon-boxes';
import DealCountdown from '@/components/deal-countdown';

const normalizeProducts = (products: any[]) =>
  products.map((p) => ({
    ...p,
    price: Number(p.price),
    rating: Number(p.rating),
    images: Array.isArray(p.images)
      ? p.images
      : JSON.parse(p.images),
  }));

const HomePage = async () => {
  const latestProductsRaw = await getLatestProducts();
  const featuredProductsRaw = await getFeaturedProducts();

  const latestProducts = normalizeProducts(latestProductsRaw);
  const featuredProducts = normalizeProducts(featuredProductsRaw);

  return (
    <div>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}

      <ProductList title='Newest Arrivals' data={latestProducts} />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </div>
  );
};

export default HomePage;
