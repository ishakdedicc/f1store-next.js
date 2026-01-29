import { requireAdmin } from '@/lib/auth-guard';
import DeleteDialog from '@/components/shared/delete-dialog';
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
import { getAllUsers, deleteUser } from '@/lib/actions/user.actions';
import { formatId } from '@/lib/utils';
import Link from 'next/link';

const AdminUserPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
}) => {
  await requireAdmin();

  const { page = '1', query = '' } = await searchParams;

  const users = await getAllUsers({
    page: Number(page),
    query,
  });

  return (
    <div className='space-y-4'>
      <div className='flex-between'>
        <h1 className='h2-bold'>Users</h1>

        {query && (
          <div className='flex items-center gap-2 text-sm'>
            <span>
              Filtered by <i>&quot;{query}&quot;</i>
            </span>
            <Link href='/admin/users'>
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
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead className='text-right w-[140px]'>
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>

                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      asChild
                      variant='outline'
                      size='sm'
                    >
                      <Link href={`/admin/users/${user.id}`}>
                        Edit
                      </Link>
                    </Button>

                    <DeleteDialog
                      id={user.id}
                      action={deleteUser}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {users.totalPages > 1 && (
          <Pagination
            page={Number(page)}
            totalPages={users.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUserPage;
