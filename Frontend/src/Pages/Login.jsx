import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/Auth/authSlice";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";



const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { loading } = useSelector((state) => state.auth);

    const handleLogin = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ username, password }));

        if (loginUser.fulfilled.match(resultAction)) {
            toast.success(`Welcome ${username}!`);
            navigate("/");
        } else {
            toast.error(resultAction.payload || "Login failed. Please try again.");

        }

    }


    return (
        <form onSubmit={handleLogin} className="flex justify-center items-start min-h-screen bg-gray-20">
            <fieldset className="mt-50 md:m-65 mx-auto fieldset bg-gray-800 border-base-300 rounded-box w-xs shadow-xl p-6">
                <legend className="fieldset-legend text-xl">Log in</legend>

                <label className="label p-2">Username</label>
                <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label className="label p-2">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="input w-full pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>


                <button className="btn btn-neutral mt-4 w-full">Login</button>

                <p className='text-center text-sm text-gray-300 mt-3'>New here?{" "}
                    <a href="/register" className='text-blue-600 hover:underline'>Create an account</a>
                </p>
            </fieldset>
        </form>

    )
}

export default Login