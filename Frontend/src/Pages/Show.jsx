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

const cleanHeading = (heading) => heading.replace(/^[^\w]+/, "").trim();

const getSectionStyle = (heading) => {
  if (/should not/i.test(heading)) return { accent: "border-l-red-500" };
  if (/should buy/i.test(heading)) return { accent: "border-l-emerald-500" };
  if (/issue/i.test(heading)) return { accent: "border-l-amber-500" };
  if (/verdict/i.test(heading)) return { accent: "border-l-indigo-500" };
  return { accent: "border-l-gray-600" };
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

  const [showStockModal, setShowStockModal] = useState(false);
  const [newStock, setNewStock] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    } finally {
      setShowDeleteModal(false);
    }
  };


  // SUMMARIZE REVIEWS USING AI
  const summarizeReviews = async () => {
    try {
      if (!reviews || reviews.length === 0) {
        toast.warning("No reviews to summarize!");
        return false;
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
      return true;
    } catch (err) {
      toast.error("AI failed to summarize");
      return false;
    } finally {
      setLoading(false);
    }
  };


  const summarizeReviewsHandler = async () => {
    const success = await summarizeReviews();
    if (success) {
      setShowSummaryModal(true);
    }
  };

  // ADD TO CART
  const CartSubmitHandler = async () => {
    if (product.stock === 0) {
      toast.error("This product is currently out of stock");
      return;
    }

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

  const updateStockHandler = async () => {
    if (newStock <= 0) {
      toast.error("Stock must be at least 1");
      return;
    }
    if (newStock > 20) {
      toast.error("Stock cannot be more than 20");
      return;
    }

    try {
      const { data } = await axios.put(
        `${api}/api/product/${id}`,
        { stock: newStock },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      SetProduct(data.data);
      toast.success("Product is back in stock!");
      setShowStockModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update stock");
    }
  };

  if (!product) {
    return <p className='text-center mt-50 text-2xl text-gray-500'>Loading product....</p>
  }

  const anyModalOpen = showSummaryModal || showStockModal || showDeleteModal;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-24 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-16 md:mt-24 pb-24">

      {/* LEFT PART (card + buttons together) */}
      <div className="w-full lg:max-w-md flex flex-col mx-auto shadow-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg">

        {/* Product Card */}
        <div className="card bg-base-100 shadow-xl ">
          <div className="relative w-full max-w-xl mx-auto p-5 ">
            <img
              className={`w-full rounded-lg object-cover ${product.stock === 0 ? "grayscale opacity-50" : ""}`}
              src={
                product.Image ||
                "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              }
              alt={product.name}
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-gray-900/90 text-gray-200 text-base font-semibold px-5 py-2 rounded-full border border-gray-700">
                  Not in Stock
                </span>
              </div>
            )}
          </div>

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
              <button className="btn btn-accent" onClick={() => navigate(`/product/edit/${id}`)}>
                Edit
              </button>
              <button className="btn btn-warning" onClick={() => setShowDeleteModal(true)}>
                Delete
              </button>
              {product.stock === 0 && (
                <button className="btn btn-success" onClick={() => setShowStockModal(true)}>
                  Back in Stock
                </button>
              )}
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

        {!anyModalOpen && (
          <>
            <p
              onClick={summarizeReviewsHandler}
              className='fixed bottom-6 right-6 sm:bottom-10 sm:right-9 bg-gray-800 text-white p-4 sm:p-5 rounded-full shadow-lg hover:bg-gray-700 cursor-pointer transition-all duration-200 text-2xl z-50'>
              <LuMessageSquareText /></p>
            {/*  tooltip */}
            {role === "seller" && (
              <span className='fixed bottom-24 right-4 sm:bottom-30 sm:right-1 bg-gray-900 text-white text-sm py-2 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-normal w-56 hidden sm:block'>
                Let AI summarize your customer reviews to understand what's working best for your product.
              </span>
            )}
            {role === "buyer" && (
              <span className='fixed bottom-24 right-4 sm:bottom-30 sm:right-1 bg-gray-900 text-white text-sm py-2 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-normal w-56 hidden sm:block'>
                Use AI to quickly understand what other customers liked about this product.
              </span>
            )}
            {loading && (
              <p className="text-gray-400 text-center fixed bottom-24 right-4 sm:bottom-3 sm:right-1 z-50">
                AI is thinking… ✨
              </p>
            )}
          </>
        )}

        {showSummaryModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">

              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">What Customers Are Saying</h2>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  aria-label="Close"
                  className="text-gray-400 hover:text-white text-2xl leading-none transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="px-6 py-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-3">
                {parseSummary(summary).map((section, i) => {
                  const style = getSectionStyle(section.heading);
                  return (
                    <div key={i} className={`bg-gray-800/40 border-l-4 ${style.accent} rounded-md p-4`}>
                      <h3 className="font-semibold mb-1.5 text-gray-100 text-sm">{cleanHeading(section.heading)}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{section.body}</p>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {showStockModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Restock Product</h3>
              <input
                type="number"
                min={1}
                max={20}
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="input input-bordered w-full"
              />
              <p className="text-xs text-gray-500">Max 20 units per product.</p>
              <div className="flex gap-3 justify-end">
                <button className="btn btn-ghost btn-sm" onClick={() => setShowStockModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary btn-sm" onClick={updateStockHandler}>
                  Set Stock
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
            <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 border border-gray-800">
              <h3 className="text-lg font-bold text-white">Delete Product?</h3>
              <p className="text-sm text-gray-400">
                Are you sure you want to delete this product?
              </p>
              <div className="flex gap-3 justify-end pt-2">
                <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteModal(false)}>
                  No
                </button>
                <button
                  className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none"
                  onClick={deleteProduct}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowProducts;