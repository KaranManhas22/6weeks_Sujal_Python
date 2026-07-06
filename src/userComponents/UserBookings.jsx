import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import { ToastContainer } from "react-toastify";

function UserBookings() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllBooking = () => {
    setLoading(true);

    const userData = JSON.parse(sessionStorage.getItem("userData"));

    APIService.getMyBooking({ user_id: userData?.id })
      .then(res => {
        console.table(res.data.data);
        setData(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.log("Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllBooking();
  }, []);

  return (
    <>
      <ToastContainer />

      <div className="container-fluid customer">
        <div className="container text-center py-1" style={{ maxWidth: 900 }}>
          <h3 className="text-white display-6 mb-4">My Bookings</h3>
          <p className="text-white">View and manage your event bookings</p>
        </div>
      </div>

      <div className="row g-4 m-5">
        {loading && (
          <div className="col-12 text-center">
            <div className="py-5">
              <div className="spinner-border text-secondary mb-3"></div>
              <div className="text-muted">Loading bookings...</div>
            </div>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="col-12">
            <div className="card border-0 shadow-sm text-center py-5">
              <h6 className="text-muted mb-0">No bookings found</h6>
            </div>
          </div>
        )}

        {!loading &&
          data.map(booking => (
            <div className="col-lg-4 col-md-6" key={booking.id}>
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small">
                      ID #{booking.id}
                    </span>

                    <span
                      className={`badge px-3 py-2 rounded-pill ${booking.status === "confirmed"
                        ? "bg-success"
                        : booking.status === "cancelled"
                          ? "bg-danger"
                          : "bg-secondary"
                        }`}
                    >
                      {booking.status === "confirmed" ? "Confirmed" : booking.status}
                    </span>
                  </div>

                  <h5 className="fw-semibold mb-3">
                    {booking.event_title}
                  </h5>

                  <div className="text-muted small mb-2">
                    Tickets: <strong>{booking.quantity}</strong>
                  </div>

                  <div className="text-muted small mb-2">
                    Start:{" "}
                    {new Date(booking.start_time).toLocaleString()}
                  </div>

                  <div className="text-muted small">
                    End:{" "}
                    {new Date(booking.end_time).toLocaleString()}
                  </div>

                </div>
              </div>
            </div>
          ))}
      </div>

    </>
  );
}

export default UserBookings;