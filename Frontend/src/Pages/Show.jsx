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
  // product is dependent upon product id so we are saying react that whenever the id changes re fetch the product basically re run the use effect tho if u dont include id in the dependency array then also it will work normal and fine but it is a good practice so remember whenever ur product is dependent on something u should pass that thing in the dependency array

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
    <div className="flex flex-col md:flex-row md:ml-40 mt-30 gap-10 space-y-6">

      {/* LEFT PART (card + buttons together) */}
      <div className="w-full md:w-3/5 lg:w-2/5 flex flex-col">

        {/* Product Card */}
        <div className="card bg-base-100 shadow-xl">
          <img
            className=" w-full sm:w-[500px] md:w-[550px] lg:w-[650px] xl:w-[750px] mx-auto rounded-lg object-cover p-5"
            src={
              product.Image ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            alt={product.name}
          />

          <div className="card-body p-6 space-x-25 space-y-3">
            <h2 className="card-title">{product.name}</h2>
            <h2 className="card-title">₹{product.price.toLocaleString("en-IN")}</h2>
            <p>{product.description}</p>
          </div>
        </div>


        {/* BUTTONS */}
        <div className="card-actions justify-start gap-3 mt-5 ml-4">
          {role === "buyer" && (
            <>
              <button className="btn btn-secondary" onClick={CartSubmitHandler}>
                Add to Cart
              </button>
            </>
          )}

          {role === "seller" && (
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

        </div>
      </div>



      {/* RIGHT PART (reviews) */}
      <div className="w-full md:w-3/5 md:ml-50 mt-10 md:mt-0 flex flex-col text-center items-center md:items-start md:text-left">
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
              className="textarea mt-5"
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
        <div className="max-h-[400px] overflow-y-auto pr-2">

          {[...reviews].reverse().length === 0 ? (
            <p className="text-gray-500 mb-10 ">No reviews yet. Be the first to review!</p>
          ) : (
            [...reviews].reverse().map((rev, index) => (
              <div
                key={index}
                className="p-2 rounded-lg mb-5 bg-gray-900 w-80 shadow-lg text-left"
              >

                <p className="text-sm text-gray-400">
                  Reviewed by: {rev.user?.username || "Anonymous"}
                </p>
                
                <div className="flex items-center gap-2">
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
                  <p className="text-gray-400 text-sm">
                    {dayjs(rev.createdAt).fromNow()}
                  </p>
                </div>

                <p className="mt-5 text-white">{rev.text}</p>
                {role === "buyer" && (
                  <button
                    className="rounded-xl text-sm bg-red-900 p-3 mt-5 cursor-pointer"
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
          className='fixed bottom-10 right-9 bg-gray-800 text-white p-5 rounded-full shadow-lg hover:bg-gray-700 cursor-pointer transition-all duration-200 text-2xl z-50'>
          <LuMessageSquareText /></p>
        {/*  tooltip */}
        {role === "seller" && (
          <>
            <span className='fixed bottom-30 right-1 bg-gray-900 text-white text-sm py-2 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-normal  w-56'>
              Let AI summarize your customer reviews to understand what’s working best for your product.
            </span>
          </>
        )}
        {role === "buyer" && (
          <>
            <span className='fixed bottom-30 right-1 bg-gray-900 text-white text-sm py-2 px-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-normalm w-56'>
              Use AI to quickly understand what other customers liked about this product.
            </span>
          </>
        )}
        {loading && (
          <p className="text-gray-400 text-center fixed bottom-3 right-1">
            AI is thinking… ✨
          </p>
        )}

        {showSummaryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">AI Summary</h2>


              <p className="text-gray-300 whitespace-pre-line">{summary}</p>


              <button
                onClick={() => setShowSummaryModal(false)}
                className="mt-6 bg-red-700  hover:bg-red-800 text-white py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>


  );
}

export default ShowProducts;




