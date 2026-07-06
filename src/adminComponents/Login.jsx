import axios from "axios";
import { useEffect, useState } from "react"
import APIService from "../APIService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const nav = useNavigate("")

    const handSubmit = (e) => {
        e.preventDefault();
        let data = {
            username: email,
            password: password,
        }

        APIService.AdminLogin(data)
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    })
                    if (res.data.data.user.role == "admin") {
                        nav('/admin');
                    } else {
                        nav('/users');
                    }
                    sessionStorage.setItem("token", res.data.data.access_token);
                    sessionStorage.setItem("userData", JSON.stringify(res.data.data.user));
                }
                else {
                    toast.error(res.data.message)
                }
            })
            .catch((err) => {
                console.log(err);
            })

        setpassword('');
        setemail('');
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={4000}
                theme="colored"
            />

            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea, #4f0797ff)" }}
            >
                <div className="card shadow-lg border-0" style={{ width: "380px", borderRadius: "15px" }}>
                    <div className="card-body p-4">
                        <h3 className="text-center fw-bold mb-4 text-primary"> Login</h3>

                        <form onSubmit={handSubmit}>
                            {/* Email */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username"
                                    value={email}
                                    onChange={(e) => setemail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Button */}
                            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}