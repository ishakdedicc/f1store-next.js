'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Review } from '@/types';

import ReviewForm from './review-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Calendar, User } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Rating from '@/components/shared/product/rating';

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReviews = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/reviews/${productId}`);
      if (!res.ok) {
        throw new Error('Failed to load reviews');
      }

      const data: Review[] = await res.json();
      setReviews(data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  return (
    <div className="space-y-4">
      {!userId && (
        <div>
          Please
          <Link
            className="text-primary px-2"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
          sign in
          </Link>
          to write a review
        </div>
      )}

      {userId && (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={loadReviews}
        />
      )}

      {!loading && reviews.length === 0 && (
        <div>No reviews yet</div>
      )}

      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle>{review.title}</CardTitle>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />

                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {review.user?.name ?? 'User'}
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
