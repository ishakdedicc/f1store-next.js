import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getAllProducts,
  deleteProduct,
} from '@/lib/actions/product.actions';
import { formatCurrency, formatId } from '@/lib/utils';
import DeleteDialog from '@/components/shared/delete-dialog';

const AdminProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
  }>;
}) => {
  await requireAdmin();

  const { page = '1', query = '', category = '' } =
    await searchParams;

  const products = await getAllProducts({
    page: Number(page),
    query,
    category,
  });

  return (
    <div className='space-y-4'>
      <div className='flex-between'>
        <h1 className='h2-bold'>Products</h1>

        {query && (
          <div className='flex items-center gap-2 text-sm'>
            <span>
              Filtered by <i>&quot;{query}&quot;</i>
            </span>
            <Link href='/admin/products'>
              <Button variant='outline' size='sm'>
                Remove Filter
              </Button>
            </Link>
          </div>
        )}

        <Button asChild>
          <Link href='/admin/products/create'>
            Create Product
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className='text-right'>
              PRICE
            </TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className='text-right w-[120px]'>
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {formatId(product.id)}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className='text-right'>
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>
                {product.category}
              </TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className='text-right'>
                <div className='flex justify-end gap-1'>
                  <Button
                    asChild
                    variant='outline'
                    size='sm'
                  >
                    <Link
                      href={`/admin/products/${product.id}`}
                    >
                      Edit
                    </Link>
                  </Button>
                  <DeleteDialog
                    id={product.id}
                    action={deleteProduct}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products.totalPages > 1 && (
        <Pagination
          page={Number(page)}
          totalPages={products.totalPages}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;
