import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import ReactStars from "react-rating-stars-component";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, addReview, removeReview, } from "../redux/Review/reviewslice"
import { LuMessageSquareText } from "react-icons/lu";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// Splits the AI summary's "## Heading" sections into { heading, body } pairs.
// Falls back to a single generic section if the text has no "##" markers at all.
const parseSummary = (text) => {
  if (!text) return [];
  if (!text.includes("##")) {
    return [{ heading: "Summary", body: text.trim() }];
  }
  return text
    .split(/\n?##\s*/)
    .filter(Boolean)
    .map((section) => {
      const [firstLine, ...rest] = section.trim().split("\n");
      return {
        heading: firstLine.replace(/:$/, "").trim(),
        body: rest.join("\n").trim(),
      };
    });
};

// Color-codes each section based on what it's actually saying
const getSectionStyle = (heading) => {
  if (/should not/i.test(heading)) return { color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/5" };
  if (/should buy/i.test(heading)) return { color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/5" };
  if (/issue/i.test(heading)) return { color: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/5" };
  if (/verdict/i.test(heading)) return { color: "text-indigo-400", border: "border-indigo-500/30", bg: "bg-indigo-500/5" };
  return { color: "text-gray-300", border: "border-gray-700", bg: "bg-gray-800/40" };
};


const ShowProducts = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //states
  const [product, SetProduct] = useState(null);

  const [newText, setnewText] = useState("");
  const [newRating, setNewRating] = useState(5);

  const [summary, setSummary] = useState("");

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { reviews } = useSelector((state) => state.review);
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.auth.userId);

  const isOwner = product && product.seller === userId;


  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${api}/api/product/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => SetProduct(res.data.data))
      .catch(err => console.log(err))
  }, [id]);

  useEffect(() => {
    dispatch(fetchReviews(id));
  }, [id, dispatch]);




  const submitReview = async () => {
    if (!newText.trim()) {
      toast.error("Review cannot be empty!");
      return;
    }
    if (newRating < 1) {
      toast.warn("Rating must be at least 1 star");
    }

    const result = await dispatch(
      addReview({
        productId: id,
        text: newText,
        rating: newRating,
      })
    );

    if (addReview.fulfilled.match(result)) {
      toast.success("Review submitted Successfully!");
      setnewText("");
      setNewRating(5);
    }
  };


  // Delete Review
  const deleteReview = async (reviewId) => {
    const result = await dispatch(removeReview({ productId: id, reviewId }));

    if (removeReview.fulfilled.match(result)) {
      toast.success("Review deleted Successfully!");
    }
  };




  const deleteProduct = async () => {
    try {
      const { data } = await axios.delete(
        `${api}/api/product/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success(data.message || "Product deleted successfully!");
      navigate("/product");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product!");
    }
  };

  // SUMMARIZE REVIEWS USING AI
  const summarizeReviews = async () => {
    try {
      if (!reviews || reviews.length === 0) {
        toast.warning("No reviews to summarize!");
        return;
      }

      setLoading(true);

      const reviewTexts = reviews.map(r => r.text);

      const res = await axios.post(
        `${api}/api/ai/summarize`,
        {
          reviews: reviewTexts,
          role: role
        },

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      setSummary(res.data.summary);
    } catch (err) {
      toast.error("AI failed to summarize");
    } finally {
      setLoading(false);
    }
  };


  const summarizeReviewsHandler = async () => {
    await summarizeReviews();
    setShowSummaryModal(true);
  };


  // ADD TO CART
  const CartSubmitHandler = async () => {
    try {
      const { data } = await axios.post(
        `${api}/api/cart/add`,
        { productid: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );



      if (data?.success == true) {
        toast.success(data.message || "Product Added To Cart");
        navigate("/product/cart")
        return;
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add to cart";
      toast.warn(msg);
      return;


    }
  }

  if (!product) {
    return <p className='text-center mt-50 text-2xl text-gray-500'>Loading product....</p>
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-24 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-16 md:mt-24 pb-24">

      {/* LEFT PART (card + buttons together) */}
      <div className="w-full lg:max-w-md flex flex-col mx-auto">

        {/* Product Card */}
        <div className="card bg-base-100 shadow-xl">
          <img
            className="w-full max-w-xl mx-auto rounded-lg object-cover p-5"
            src={
              product.Image ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            alt={product.name}
          />

          <div className="card-body p-6 space-y-3">
            <h2 className="card-title">{product.name}</h2>
            <h2 className="card-title">₹{product.price.toLocaleString("en-IN")}</h2>
            <p>{product.description}</p>
          </div>
        </div>


        {/* BUTTONS */}
        <div className="card-actions justify-start flex-wrap gap-3 mt-5">
          {role === "buyer" && (
            <>
              <button className="btn btn-secondary" onClick={CartSubmitHandler}>
                Add to Cart
              </button>
            </>
          )}

          {role === "seller" && isOwner && (
            <>

              <button
                className="btn btn-accent"
                onClick={() => navigate(`/product/edit/${id}`)}
              >
                Edit
              </button>

              <button className="btn btn-warning" onClick={deleteProduct}>
                Delete
              </button>
            </>
          )}

          {role === "seller" && !isOwner && (
            <p className="text-sm text-gray-500 italic mt-2">
              Only the seller who listed this product can edit or delete it.
            </p>
          )}

        </div>
      </div>



      {/* RIGHT PART (reviews) */}
      <div className="w-full lg:flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
        {role == "buyer" && (
          <>
            <h1 className="text-2xl font-bold mb-5">Leave a Review</h1>

            <ReactStars
              count={5}
              value={newRating}
              onChange={(newValue) => setNewRating(newValue)}
              size={40}
              isHalf={true}
              edit={true}
              activeColor="#facc15"
              color="#4b5563"
              emptyIcon={<i className="far fa-star" />}
              halfIcon={<i className="fa fa-star-half-alt" />}
              filledIcon={<i className="fa fa-star" />}
            />

            <textarea
              className="textarea mt-5 w-full max-w-md"
              rows={3}
              placeholder="Write your review..."
              value={newText}
              onChange={(e) => setnewText(e.target.value)}
            />

            <button onClick={submitReview} className="btn btn-primary block mt-4">
              Submit
            </button>

          </>
        )}

        <h2 className="text-xl semi-bold mt-10 mb-3">Customer Reviews</h2>
        <div className="max-h-[400px] overflow-y-auto w-full max-w-md flex flex-col items-center">
          {[...reviews].reverse().length === 0 ? (
            <div className="w-full max-w-md rounded-xl border border-dashed border-gray-700 py-8 px-4 text-center">
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            [...reviews].reverse().map((rev, index) => (
              <div
                key={index}
                className="p-4 rounded-xl mb-4 bg-gray-900 w-full shadow-lg text-left border border-gray-800"
              >
                <p className="text-sm text-gray-400">
                  Reviewed by: {rev.user?.username || "Anonymous"}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <ReactStars
                    count={5}
                    value={rev.rating}
                    edit={false}
                    size={20}
                    isHalf={true}
                    activeColor="#facc15"
                    color="#4b5563"
                    emptyIcon={<i className="far fa-star" />}
                    halfIcon={<i className="fa fa-star-half-alt" />}
                    filledIcon={<i className="fa fa-star" />}
                  />
                  <p className="text-gray-400 text-xs">
                    {dayjs(rev.createdAt).fromNow()}
                  </p>
                </div>

                <p className="mt-3 text-white text-sm sm:text-base leading-relaxed">
                  {rev.text}
                </p>

                {role === "buyer" && (
                  <button
                    className="rounded-lg text-xs bg-red-900/80 hover:bg-red-800 px-3 py-2 mt-4 cursor-pointer text-white transition-colors"
                    onClick={() => deleteReview(rev._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>


      <div className="relative group">

        <p
          onClick={summarizeReviewsHandler}
          className='fixed bottom-6 right-6 sm:bottom-10 sm:right-9 bg-gray-800 text-white p-4 sm:p-5 rounded-full shadow-lg hover:bg-gray-700 cursor-pointer transition-all duration-200 text-2xl z-50'>
          <LuMessageSquareText /></p>
        {/*  tooltip */}
        {role === "seller" && (
          <>
            <span className='fixed bottom-24 right-4 sm:bottom-30 sm:right-1 bg-gray-900 text-white text-sm py-2 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-normal w-56 hidden sm:block'>
              Let AI summarize your customer reviews to understand what's working best for your product.
            </span>
          </>
        )}
        {role === "buyer" && (
          <>
            <span className='fixed bottom-24 right-4 sm:bottom-30 sm:right-1 bg-gray-900 text-white text-sm py-2 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-normal w-56 hidden sm:block'>
              Use AI to quickly understand what other customers liked about this product.
            </span>
          </>
        )}
        {loading && (
          <p className="text-gray-400 text-center fixed bottom-24 right-4 sm:bottom-3 sm:right-1 z-50">
            AI is thinking… ✨
          </p>
        )}

        {showSummaryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">

              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">What Customers Are Saying</h2>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  aria-label="Close"
                  className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
                >
                  &times;
                </button>
              </div>

              <div className="px-6 py-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-4">
                {parseSummary(summary).map((section, i) => {
                  const style = getSectionStyle(section.heading);
                  return (
                    <div key={i} className={`rounded-xl border p-4 ${style.border} ${style.bg}`}>
                      <h3 className={`font-semibold mb-2 ${style.color}`}>{section.heading}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{section.body}</p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>


  );
}

export default ShowProducts;