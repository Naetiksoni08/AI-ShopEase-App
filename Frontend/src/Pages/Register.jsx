import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/Auth/authSlice";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("buyer");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.auth);

    const handleRegister = async (e) => {
        e.preventDefault();

        const resultAction = await dispatch(registerUser({ username, email, password, role }));
        if (registerUser.fulfilled.match(resultAction)) {
            toast.success("Registered Successfully!");
            setUsername("");
            setemail("");
            setPassword("");
            navigate("/login");

        } else {

            toast.error(resultAction.payload || "Registration failed. Please try again.");

        }

    }


    return (
        <form onSubmit={handleRegister} className="flex justify-center items-start min-h-screen bg-gray-20">
            <fieldset className="mt-35 md:m-45 mx-auto fieldset bg-gray-800 border-base-300 rounded-box w-xs p-6">
                <legend className="fieldset-legend text-xl">Register</legend>

                <label className="label p-2">Username</label>
                <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label className="label p-2">Email</label>
                <input type="email" className="input" value={email} onChange={(e) => setemail(e.target.value)} />

                <label className="label p-2">Password</label>
                <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />

                <label className="label p-2">Role</label>
                <select className='input' value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>

                <button className="btn btn-neutral mt-4 w-full">Register</button>


                <p className='text-center text-sm text-gray-300 mt-3'> Already have an account?{" "}
                    <a href="/login" className='text-blue-600 hover:underline'>Sign in</a>
                </p>
            </fieldset>
        </form >
    )
}

export default Register