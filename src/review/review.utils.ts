import {ReviewsType} from "../product/dto/get-product.response";

export const generateReviewsResponse = (reviews: ReviewsType[]) => {
  return reviews.map((review) => ({
    ...review,
    userId: {
      _id: review.userId._id,
      email: review.userId.email,
      username: review.userId.username,
      role: review.userId.role,
    },
  }));
}