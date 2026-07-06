import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIService from "../APIService";
import { ToastContainer, toast } from "react-toastify";

function Bookings() {
    const { id } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const getBookings = async () => {
        setLoading(true);
        try {
            let res;
            if (id) {
                res = await APIService.getBookingsByEvent(id);
            } else {
                res = await APIService.getAllBooking();
            }
            setBookings(res.data?.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getBookings();
    }, [id]);

    // ---------------- UPDATE STATUS ----------------
    const updateStatus = async (booking, status) => {
        try {
            setUpdatingId(booking.id);

            await APIService.updateBookingStatus(booking.id, { status });

            sendEmailFun(booking,status);

            toast.success(`Booking ${status} successfully`);
            getBookings();
        } catch (err) {
            console.log(err);
            toast.error("Failed to update booking status");
        } finally {
            setUpdatingId(null);
        }
    };

    async function sendEmailFun(booking,status){
        try {

            const userData = await APIService.singleUser(booking.user_id);

            if(status=="cancelled") {

                let data = {
                    "recipient_email": userData.data.data.email,
                    "recipient_name": userData.data.data.first_name,
                    "event_title": booking.event_title,
                    "start_time": booking.start_time,
                    "booking_id": booking.id
                }

                await APIService.sendCancellation(data);
                toast.success(`Booking ${"email sent "} successfully`)

            } else {

                
            let data = {
                "recipient_email": userData.data.data.email,
                "recipient_name": userData.data.data.first_name,
                "notification_type": "booking_confirmation",
                "data": {
                    "event_title": booking.event_title,
                    "start_time": booking.start_time,
                    "duration": 120,
                    "booking_id": booking.id
                }
            }

            await APIService.sendEmail(data);

            toast.success(`Booking ${"email sent "} successfully`);

            }

            getBookings();
        } catch (err) {
            console.log(err);
            toast.error("fWailed to Sent Booking Status Update Email");
        } finally {
            setUpdatingId(null);
        }

    }

    async function sendRemainder(booking) {
            try {

            const userData = await APIService.singleUser(booking.user_id);
                
            let data = {
                "recipient_email": userData.data.data.email,
                "recipient_name": userData.data.data.first_name,
                "event_title": booking.event_title,
                "start_time": booking.start_time,
                "Location": "Contact Booking Support"
                
            }

            await APIService.sendRemainder(data);
            toast.success(`Booking remainder sent successfully`);
            getBookings();
        } catch (err) {
            console.log(err);
            toast.error("fWailed to Sent Booking Status Update Email");
        } finally {
            setUpdatingId(null);
        }

    }

    
    return (
        <>
            <ToastContainer />

            {/* ---------- HEADER ---------- */}
            <div className="container-fluid customer">
                <div className="container text-center py-1">
                    <h3 className="text-white display-6 mb-4">
                        {id ? "Bookings for Event" : "All Bookings"}
                    </h3>
                </div>
            </div>

            {/* ---------- TABLE ---------- */}
            <div className="container py-4">
                <div className="card shadow-sm rounded-4">
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Event</th>
                                    <th>User ID</th>
                                    <th>Slot Start</th>
                                    <th>Slot End</th>
                                    <th>Seats</th>
                                    <th>Status</th>
                                    <th>Booked At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {!loading && bookings.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted py-4">
                                            No bookings found
                                        </td>
                                    </tr>
                                )}

                                {bookings.map((booking, index) => (
                                    <tr key={booking.id}>
                                        <td>{index + 1}</td>
                                        <td>{booking.event_title}</td>
                                        <td>{booking.user_id}</td>
                                        <td>{new Date(booking.start_time).toLocaleString()}</td>
                                        <td>{new Date(booking.end_time).toLocaleString()}</td>
                                        <td>{booking.quantity}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    booking.status === "confirmed"
                                                        ? "bg-success"
                                                        : booking.status === "cancelled"
                                                        ? "bg-danger"
                                                        : "bg-warning"
                                                }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(booking.created_at).toLocaleString()}
                                        </td>

                                        {/* ---------- ACTION CHIPS ---------- */}
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-success rounded-pill"
                                                    disabled={
                                                        booking.status === "confirmed" ||
                                                        updatingId === booking.id
                                                    }
                                                    onClick={() =>
                                                        updateStatus(booking, "confirmed")
                                                    }
                                                >
                                                    Confirm
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-danger rounded-pill"
                                                    disabled={
                                                        booking.status === "cancelled" ||
                                                        updatingId === booking.id
                                                    }
                                                    onClick={() =>
                                                        updateStatus(booking, "cancelled")
                                                    }
                                                >
                                                    Cancel
                                                </button>


                                                <button className="btn btn-sm btn-outline-danger rounded-pill"
                                                    disabled={
                                                        booking.status != "confirmed" ||
                                                        updatingId === booking.id
                                                    }
                                                    onClick={() =>
                                                        sendRemainder(booking)
                                                    }
                                                >
                                                    Remainder
                                                </button>
                                            </div>
                                        </td>

                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {loading && (
                        <div className="text-center py-3 fw-semibold">
                            Loading bookings...
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Bookings;
