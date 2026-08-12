function calculateAverageRating(reviews) {
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? Number(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        )
      : 0;
  
    return { averageRating, totalReviews };
  }
  
  module.exports = { calculateAverageRating };