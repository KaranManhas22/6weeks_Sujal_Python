import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UserEvents() {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Booking Modal State
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");

    // ----------------------- Get All Events -----------------------
    const getAllEvents = () => {
        setLoading(true);

        APIService.getAllEvents()
            .then(res => {
                setData(res.data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.log("Error:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        getAllEvents();
    }, []);

    // ----------------------- Open Booking Modal -----------------------
    const openBookingModal = event => {
        setSelectedEvent(event);
        setQuantity("");
        setError("");

        const modal = new window.bootstrap.Modal(
            document.getElementById("bookingModal")
        );
        modal.show();
    };

    // ----------------------- Create Booking -----------------------
    const handleBooking = async () => {
        if (!quantity || quantity <= 0) {
            setError("Quantity is required");
            return;
        }

        try {
            const payload = {
                event_id: selectedEvent.id,
                quantity: quantity
            };

            const res = await APIService.createBooking(payload);

            if (res.data.success) {
                toast.success("Booking Successful");

                const modal = window.bootstrap.Modal.getInstance(
                    document.getElementById("bookingModal")
                );
                modal.hide();

                setTimeout(() => {
                    navigate("/users/bookings");
                }, 2000);
            } else {
                toast.error("Booking Failed");
            }
        } catch (error) {
            console.log(error);
            toast.error("Server Error");
        }
    };

    return (
        <>
            <ToastContainer />

            <div className="container-fluid customer">
                <div className="container text-center py-1" style={{ maxWidth: 900 }}>
                    <h3 className="text-white display-6 mb-4">Available Events</h3>
                    <p className="text-white">
                        Browse events and book your seats instantly
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="row g-4 m-5">
                {/* Loading State */}
                {loading && (
                    <div className="col-12 text-center">
                        <div className="py-5">
                            <div className="spinner-border text-secondary mb-3"></div>
                            <div className="text-muted">Loading events...</div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && data.length === 0 && (
                    <div className="col-12">
                        <div className="card border-0 shadow-sm text-center py-5">
                            <h6 className="text-muted mb-0">No events found</h6>
                        </div>
                    </div>
                )}

                {/* Event Cards */}
                {!loading &&
                    data.map(event => (
                        <div className="col-lg-4 col-md-6" key={event.id}>
                            <div className="card border-0 shadow-sm h-100 rounded-4">
                                <div className="card-body p-4 d-flex flex-column">

                                    {/* Event Title */}
                                    <h5 className="fw-semibold mb-2">{event.title}</h5>

                                    {/* Description */}
                                    <p className="text-muted small mb-3">
                                        {event.description}
                                    </p>

                                    {/* Info */}
                                    <div className="mb-2 text-muted small">
                                        Capacity: <strong>{event.capacity}</strong>
                                    </div>

                                    <div className="mb-4 text-muted small">
                                        Duration:{" "}
                                        <strong>{event.duration_minutes} min</strong>
                                    </div>

                                    {/* Action */}
                                    <div className="mt-auto">
                                        <button
                                            className="btn btn-primary w-100 rounded-pill"
                                            onClick={() => navigate(`/users/events/${event.id}/slots`)}
                                        >
                                            View Slots
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* -------------------- Booking Modal -------------------- */}
            < div className="modal fade" id="bookingModal" tabIndex="-1" >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow">

                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-semibold">
                                Book Event
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        <div className="modal-body pt-2">
                            <p className="text-muted mb-3">
                                {selectedEvent?.title}
                            </p>

                            <label className="form-label">Enter Quantity</label>
                            <input
                                type="number"
                                className={`form-control rounded-3 ${error ? "is-invalid" : ""
                                    }`}
                                value={quantity}
                                onChange={e => {
                                    setQuantity(e.target.value);
                                    setError("");
                                }}
                                min="1"
                            />
                            {error && (
                                <div className="invalid-feedback">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer border-0">
                            <button
                                className="btn btn-primary w-100 rounded-pill"
                                onClick={handleBooking}
                            >
                                Confirm Booking
                            </button>
                        </div>

                    </div>
                </div>
            </div >
        </>
    );
}

export default UserEvents;