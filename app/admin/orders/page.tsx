import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  deleteOrder,
  getAllOrders,
} from '@/lib/actions/order.actions';
import {
  formatCurrency,
  formatDateTime,
  formatId,
} from '@/lib/utils';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'Admin Orders',
};

const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}) => {
  await requireAdmin();

  const { page = '1', query = '' } = await searchParams;

  const orders = await getAllOrders({
    page: Number(page),
    query,
  });

  return (
    <div className='space-y-4'>
      <div className='flex-between'>
        <h1 className='h2-bold'>Orders</h1>

        {query && (
          <div className='flex items-center gap-2 text-sm'>
            <span>
              Filtered by <i>&quot;{query}&quot;</i>
            </span>
            <Link href='/admin/orders'>
              <Button variant='outline' size='sm'>
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>BUYER</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead className='text-right w-[140px]'>
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>

                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>

                <TableCell>{order.user.name}</TableCell>

                <TableCell>
                  {formatCurrency(order.totalPrice)}
                </TableCell>

                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Not Paid'}
                </TableCell>

                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'Not Delivered'}
                </TableCell>

                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      asChild
                      variant='outline'
                      size='sm'
                    >
                      <Link href={`/order/${order.id}`}>
                        Details
                      </Link>
                    </Button>

                    <DeleteDialog
                      id={order.id}
                      action={deleteOrder}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page)}
            totalPages={orders.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
