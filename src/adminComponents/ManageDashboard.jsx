import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";


function ManageDashboard() {
    return (
        <>
            {/* Header */}
            <div className="container-fluid customer">
                <div
                    className="container text-center py-4"
                    style={{ maxWidth: 900 }}
                >
                    <h3 className="text-white display-6 mb-1">
                        Dashboard
                    </h3>
                    
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="container my-5" style={{ minHeight: "50vh" }}>
                <div className="row g-4">
                    <h4 className="text-center">
                        Welcome back!
                    </h4>
                    
                    {/* Users */}
                    <div className="col-md-6 col-lg-3">
                        <Link to="users" className="text-decoration-none">
                            <div className="card shadow-sm h-100 dashboard-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Users</h5>
                                    <p className="card-text text-muted">
                                        Manage all registered users
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Analytics */}
                    <div className="col-md-6 col-lg-3">
                        <Link to="booking/analytics" className="text-decoration-none">
                            <div className="card shadow-sm h-100 dashboard-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Analytics</h5>
                                    <p className="card-text text-muted">
                                        View performance insights
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Events */}
                    <div className="col-md-6 col-lg-3">
                        <Link to="events" className="text-decoration-none">
                            <div className="card shadow-sm h-100 dashboard-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Events</h5>
                                    <p className="card-text text-muted">
                                        Create and manage events
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Bookings */}
                    <div className="col-md-6 col-lg-3">
                        <Link to="bookings/all" className="text-decoration-none">
                            <div className="card shadow-sm h-100 dashboard-card">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Bookings</h5>
                                    <p className="card-text text-muted">
                                        Track and manage bookings
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                </div>

                <ToastContainer />
            </div>
        </>
    );
}

export default ManageDashboard;
