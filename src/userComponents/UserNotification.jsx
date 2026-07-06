import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import { ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function UserNotification() {
  const { email } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAllNotification = async () => {
    try {
      setLoading(true);

      const userData = JSON.parse(sessionStorage.getItem("userData"));
      if (!userData?.email) {
        setData([]);
        return;
      }

      const res = await APIService.NotificationFetch(email);

      setData(res?.data?.data?.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllNotification();
  }, []);

  return (
    <>
      <ToastContainer />

      <div className="container-fluid customer">
        <div className="container text-center py-1" style={{ maxWidth: 900 }}>
          <h3 className="text-white display-6 mb-4">My Notifications</h3>
          <p className="text-white">View and manage your notifications</p>
        </div>
      </div>

      <div className="row g-4 m-5">
          <div className="d-flex justify-content-end">
              <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
                          ← Back to Users
              </button>
          </div>
        {loading && (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-secondary mb-3" />
            <div className="text-muted">Loading notifications...</div>
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="col-12">
            <div className="card border-0 shadow-sm text-center py-5">
              <h6 className="text-muted mb-0">No notifications found</h6>
            </div>
          </div>
        )}

        {!loading &&
          data.map(notification => (
            <div className="col-lg-4 col-md-6" key={notification.id}>
              <div className="card border-0 shadow-sm h-100 rounded-4">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <span className="primary small fw-bold">
                      {notification.subject}
                    </span>
                  </div>

                  <div
                    className="text-muted small"
                    dangerouslySetInnerHTML={{
                      __html: notification.body,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default UserNotification;
