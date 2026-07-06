import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import { ClipLoader } from "react-spinners";

export default function Admin() {
    const [data, setData] = useState(null);

    useEffect(() => {
       
    }, []);

    return (
        <>
            {/* Header Start */}
            <div className="container-fluid bg-admin">
                <div
                    className="container text-center py-5"
                    style={{ maxWidth: 900 }}
                >
                    <h3 className="text-white display-3 mb-4">
                        Admin Dashboard
                    </h3>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item">
                            <a href="index.html">Admin</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="#">Pages</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="#">Dashboard</a>
                        </li>
                        <li className="breadcrumb-item active text-white" />
                    </ol>
                </div>
            </div>
            {/* Header End */}

            <div className="container my-5">
                <h1 className="text-center mb-5">Admin Dashboard</h1>
                {data ? (
                    <div className="row">
                        {/* booking */}
                        <div className="col-md-4">
                            <div className="card shadow-sm mb-5">
                                <img
                                    src="/assets/img/tb.jpg"
                                    alt="Service Icon"
                                    className="card-img-top"
                                    style={{
                                        height: "250px",
                                        objectFit: "contain"
                                    }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title">
                                        Total Bookings
                                    </h5>
                                    <h2 className="card-text">
                                        {data.totalBooking}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Customer */}
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <img
                                    src="/assets/img/tc.jpg"
                                    alt="Service Icon"
                                    className="card-img-top"
                                    style={{
                                        height: "250px",
                                        objectFit: "contain"
                                    }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title">
                                        Total Customers
                                    </h5>
                                    <h2 className="card-text">
                                        {data.totalCustomer}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* category */}
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <img
                                    src="/assets/img/a.webp"
                                    alt="Service Icon"
                                    className="card-img-top"
                                    style={{
                                        height: "250px",
                                        objectFit: "contain"
                                    }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title">
                                        Total Categories
                                    </h5>
                                    <h2 className="card-text">
                                        {data.totalCategory}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Review  */}
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <img
                                    src="/assets/img/a.webp"
                                    alt="Service Icon"
                                    className="card-img-top"
                                    style={{
                                        height: "250px",
                                        objectFit: "contain"
                                    }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title">
                                        Total Reviews
                                    </h5>
                                    <h2 className="card-text">
                                        {data.totalReview}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Service Card */}
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <img
                                    src="/assets/img/ts.jpg"
                                    alt="Service Icon"
                                    className="card-img-top"
                                    style={{
                                        height: "250px",
                                        objectFit: "contain"
                                    }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title">
                                        Total Services
                                    </h5>
                                    <h2 className="card-text">
                                        {data.totalService}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Service Provider  */}
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <img
                                    src="/assets/img/a.webp"
                                    alt="Service Icon"
                                    className="card-img-top"
                                    style={{
                                        height: "250px",
                                        objectFit: "contain"
                                    }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title">
                                        Total Service Providers
                                    </h5>
                                    <h2 className="card-text">
                                        {data.totalServiceProvider}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">
                        <ClipLoader />
                    </p>
                    // <ClipLoader></ClipLoader>
                )}
            </div>
        </>
    );
}
