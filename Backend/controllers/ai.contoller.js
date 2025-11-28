const ReviewAgent = require("../AI/Agents/review.agent");

module.exports.summarize = async (req, res) => {
  try {
    const { reviews , role } = req.body;

    if (!reviews || reviews.length === 0) {
      return res.status(400).json({ message: "Reviews are required" });
    }

    const summary = await ReviewAgent.summarizeReviews(reviews, role);

    res.json({ success: true, summary });

  } catch (err) {
    console.log("AI ERROR:", err);
    res.status(500).json({ message: "Summarization failed" });
  }
};
