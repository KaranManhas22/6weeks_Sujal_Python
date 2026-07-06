import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import APIService from "../APIService";
import { toast, ToastContainer } from "react-toastify";

function UserEventSlots() {
    const { id } = useParams();       // event id
    const navigate = useNavigate();

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    // Booking modal state
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");

    // Fetch slots
    const getSlots = async () => {
        try {
            setLoading(true);
            // const res = await APIService.getAvailableSlots(id);
            const res =  await APIService.getSlotDemands(id);
            console.log();
            setSlots(res.data.data.all_recommendations || []);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load slots");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSlots();
    }, []);

    // ---------------------- Open Booking Modal ----------------------
    const chooseSlot = (slot) => {
        setSelectedSlot(slot);
        setQuantity("");
        setError("");

        const modal = new window.bootstrap.Modal(
            document.getElementById("bookingModal")
        );
        modal.show();
    };

    // ---------------------- Create Booking ----------------------
    const handleBooking = async () => {
        if (!quantity || quantity <= 0) {
            setError("Quantity is required");
            return;
        }

        try {
            const payload = {
                event_id: id,
                slot_id: selectedSlot.slot_id,
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
                }, 1000);

            } else {
                toast.error(res.data.message || "Booking Failed");
            }
        } catch (err) {
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

            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-3">Available Slots</h3>
                <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
                    ← Back to Events
                </button>

                </div>

                {loading && <div className="text-muted">Loading slots...</div>}

                {!loading && slots.length === 0 && (
                    <div className="alert alert-warning">No slots available</div>
                )}

                <div className="row g-4">
  {slots.map((slot) => (
    <div className="col-md-4" key={slot.slot_id}>
      <div
        className="card border-0 shadow-sm rounded-4 p-3 slot-card h-100"
        style={{ transition: "0.2s", cursor: "pointer" }}
        onClick={() => chooseSlot(slot)}
      >
        {/* Date Badge */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-secondary px-3 py-2 fs-6">
             {slot.date} 
          </span>
        </div>

       
        {/* Time Range Block */}
        <div className="bg-light rounded-3 p-3 mb-2">
          <div className="fw-bold fs-5">
         {new Date(slot.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
            {" — "}
            {new Date(slot.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-muted small mt-1">
            {new Date(slot.start_time).toLocaleString()}
          </div>
           <div className={`d-flex my-2 justify-content-start ${slot?.is_high_demand?"text-danger":(slot?.is_medium_demand?"text-warning":"text-success")}`}> <strong>{slot.demand_prediction?.recommendation}</strong> </div>
        </div>

        {/* Seats or Description (Optional) */}
        {slot.capacity && (
          <p className="small text-muted mb-2">
            Available Seats: <span className="fw-semibold">{slot.capacity}</span>
          </p>
        )}

        {/* CTA Button */}
        <button
          className="btn btn-primary w-100 rounded-pill mt-2"
          onClick={(e) => {
            e.stopPropagation();
            chooseSlot(slot);
          }}
        >
          Select Slot
        </button>
      </div>
    </div>
  ))}
</div>

            </div>

            {/* ------------------ Booking Modal ------------------ */}
            <div className="modal fade" id="bookingModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-4">

                        <div className="modal-header border-0">
                            <h5 className="modal-title">Book Slot</h5>
                            <button className="btn-close" data-bs-dismiss="modal" />
                        </div>

                        <div className="modal-body my-0 py-0">
                            {selectedSlot && (
                                <p className="text-muted">
                                    <strong>{selectedSlot.date}</strong> <br />
                                    {new Date(selectedSlot.start_time).toLocaleString()} → {new Date(
                                        selectedSlot.end_time
                                    ).toLocaleString()}
                                </p>
                            )}

                            <label className="form-label">Enter Capacity</label>
                            <input
                                type="number"
                                className={`form-control ${error ? "is-invalid" : ""}`}
                                value={quantity}
                                onChange={(e) => { setQuantity(e.target.value); setError(""); }}
                                min="1"
                            />

                            {error && <div className="invalid-feedback">{error}</div>}
                        </div>

                        <div className="modal-footer border-0">
                            <button className="btn btn-primary w-100 rounded-pill" onClick={handleBooking}>
                                Confirm Booking
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default UserEventSlots;
