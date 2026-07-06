import React from "react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

function UserDashboard() {
  return (
    <>
      <>
        <div className="container-fluid customer">
          <div className="container text-center py-1" style={{ maxWidth: 900 }}>
            <h3 className="text-white display-6 mb-4">Home  </h3>
          </div>
        </div>
      </>

      <div className="container-fluid" style={{ minHeight: "50vh" }}>
        <ToastContainer />

        <div className="container my-5" style={{ minHeight: "50vh" }}>
          <div className="row g-4">
            <h4 className="text-center">
              Welcome back!
            </h4>

            {/* Users */}
            <div className="col-lg-6">
              <Link to="events" className="text-decoration-none">
                <div className="card shadow-sm h-100 dashboard-card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Events</h5>
                    <p className="card-text text-muted">
                      Explore all Events
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Analytics */}
            <div className="col-lg-6">
              <Link to="bookings" className="text-decoration-none">
                <div className="card shadow-sm h-100 dashboard-card">
                  <div className="card-body text-center">
                    <h5 className="card-title">My Bookings</h5>
                    <p className="card-text text-muted">
                      View all your bookings
                    </p>
                  </div>
                </div>
              </Link>
            </div>

          </div>

          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default UserDashboard;