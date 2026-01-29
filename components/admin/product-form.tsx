'use client';

import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import slugify from 'slugify';
import Image from 'next/image';
import { toast } from 'sonner';
import { insertProductSchema } from '@/lib/validator';
import { productDefaultValues } from '@/lib/constants';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { Product } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { UploadButton } from '@/lib/uploadthing';

type FormValues = z.input<typeof insertProductSchema>;

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update'
        ? {
            ...product,
            images: Array.isArray(product.images)
              ? product.images
              : JSON.parse(product.images as unknown as string),
            price: Number(product.price),
            stock: Number(product.stock),
          }
        : productDefaultValues,
  });

  const images = form.watch('images') ?? [];
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const parsed = insertProductSchema.parse(values);

    if (type === 'Create') {
      const res = await createProduct(parsed);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      router.push('/admin/products');
      return;
    }

    if (!productId) {
      router.push('/admin/products');
      return;
    }

    const res = await updateProduct({
      ...parsed,
      id: productId,
    });

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.push('/admin/products');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='flex flex-col md:flex-row gap-5'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className='flex gap-2'>
                    <Input
                      placeholder='product-slug'
                      {...field}
                      className='flex-1'
                    />
                    <Button
                      type='button'
                      variant='secondary'
                      className='shrink-0 px-4'
                      onClick={() => {
                        const name = form.getValues('name');
                        if (!name) {
                          toast.error('Enter name first');
                          return;
                        }
                        form.setValue(
                          'slug',
                          slugify(name, { lower: true })
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col md:flex-row gap-5'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Brand' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col md:flex-row gap-5'>
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    value={Number(field.value ?? 0)}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='stock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    value={Number(field.value ?? 0)}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='images'
          render={() => (
            <FormItem>
              <FormLabel>Images</FormLabel>

              <Card>
                <CardContent className='flex flex-wrap gap-3 mt-2'>
                  {images.map((img, i) => (
                    <div
                      key={img}
                      className='relative w-20 h-20 rounded overflow-hidden border'
                    >
                      <Image
                        src={img}
                        alt={`product-${i}`}
                        fill
                        className='object-cover'
                      />

                      <button
                        type='button'
                        className='absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition'
                        onClick={() => {
                          form.setValue(
                            'images',
                            images.filter(
                              (image) => image !== img
                            )
                          );
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <UploadButton
                    endpoint='imageUploader'
                    onClientUploadComplete={(res) => {
                      if (!res?.length) return;
                      form.setValue('images', [
                        ...images,
                        res[0].url,
                      ]);
                    }}
                    onUploadError={(err) => {
                      toast.error(err.message);
                    }}
                  />
                </CardContent>
              </Card>

              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardContent className='space-y-4'>
            <FormField
              control={form.control}
              name='isFeatured'
              render={({ field }) => (
                <FormItem className='flex items-center gap-2'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Featured Product</FormLabel>
                </FormItem>
              )}
            />

            {isFeatured && banner && (
              <Image
                src={banner}
                alt='banner'
                width={1920}
                height={680}
                className='rounded object-cover'
              />
            )}

            {isFeatured && !banner && (
              <UploadButton
                endpoint='imageUploader'
                onClientUploadComplete={(res) => {
                  if (!res?.length) return;
                  form.setValue('banner', res[0].url);
                }}
                onUploadError={(err) => {
                  toast.error(err.message);
                }}
              />
            )}
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className='resize-none'
                  placeholder='Product description'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          size='lg'
          disabled={form.formState.isSubmitting}
          className='w-full'
        >
          {form.formState.isSubmitting
            ? 'Submitting...'
            : `${type} Product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;
