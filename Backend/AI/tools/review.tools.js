module.exports = {
    formatReviews: function (reviews) {
      if (!Array.isArray(reviews)) return "";
      return reviews.join("\n\n");
    }
  };