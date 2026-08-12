const { calculateAverageRating } = require("../utils/calculateRating");

describe("calculateAverageRating", () => {
  it("returns 0 average and 0 count for an empty array", () => {
    const result = calculateAverageRating([]);
    expect(result).toEqual({ averageRating: 0, totalReviews: 0 });
  });

  it("returns that same rating when there is only one review", () => {
    const result = calculateAverageRating([{ rating: 4 }]);
    expect(result).toEqual({ averageRating: 4, totalReviews: 1 });
  });

  it("averages multiple reviews correctly", () => {
    const result = calculateAverageRating([
      { rating: 5 },
      { rating: 3 },
      { rating: 4 },
    ]);
    // (5 + 3 + 4) / 3 = 4.0
    expect(result).toEqual({ averageRating: 4, totalReviews: 3 });
  });

  it("rounds the average to 1 decimal place", () => {
    const result = calculateAverageRating([
      { rating: 5 },
      { rating: 4 },
      { rating: 4 },
    ]);
    expect(result.averageRating).toBe(4.3);
    expect(result.totalReviews).toBe(3);
  });
});