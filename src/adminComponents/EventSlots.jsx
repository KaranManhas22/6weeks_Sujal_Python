import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIService from "../APIService";
import { toast, ToastContainer } from "react-toastify";

function EventSlots() {
    const { id } = useParams();

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    // ---------------- ADD SLOT MODAL STATE ----------------
    const [dateSlots, setDateSlots] = useState([
        { date: "", time_ranges: [{ start_time: "", end_time: "" }] }
    ]);

    const openAddSlotModal = () => {
        setDateSlots([{ date: "", time_ranges: [{ start_time: "", end_time: "" }] }]);
        new window.bootstrap.Modal(document.getElementById("slotModal")).show();
    };

    // ---------------- FETCH AVAILABLE SLOTS ----------------
    const getSlots = () => {
        setLoading(true);
        APIService.getAvailableSlots(id)
            .then(res => {
                setSlots(res.data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        getSlots();
    }, []);

    // ---------------- ADD SLOTS HANDLERS ----------------
    const handleSlotChange = (dateIndex, timeIndex, field, value) => {
        const updated = [...dateSlots];
        updated[dateIndex].time_ranges[timeIndex][field] = value;
        setDateSlots(updated);
    };

    const addDateSlot = () =>
        setDateSlots([...dateSlots, { date: "", time_ranges: [{ start_time: "", end_time: "" }] }]);

    const addTimeRange = (dateIndex) => {
        const updated = [...dateSlots];
        updated[dateIndex].time_ranges.push({ start_time: "", end_time: "" });
        setDateSlots(updated);
    };

    const submitTimeSlots = async () => {

        // VALIDATION
        for (let i = 0; i < dateSlots.length; i++) {
            const slot = dateSlots[i];

            if (!slot.date || slot.date.trim() === "") {
                toast.error(`Date cannot be empty for slot ${i + 1}`);
                return;
            }

            if (!slot.time_ranges || slot.time_ranges.length === 0) {
                toast.error(`Add at least one time range for date ${slot.date}`);
                return;
            }

            for (let j = 0; j < slot.time_ranges.length; j++) {
                const range = slot.time_ranges[j];

                if (!range.start_time || !range.end_time) {
                    toast.error(`Start & end time required (Date: ${slot.date})`);
                    return;
                }

                if (range.end_time <= range.start_time) {
                    toast.error(`End time must be later than start time (Date: ${slot.date})`);
                    return;
                }
            }
        }

        try {
            const payload = { date_slots: dateSlots };
            const res = await APIService.addTimeSlots(id, payload);

            if (res.data.success) toast.success(res.data.message);
            else toast.error(res.data.data.errors?.[0]?.error || "Failed to add slots");

            getSlots();
            new window.bootstrap.Modal(document.getElementById("slotModal")).hide();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <ToastContainer />

            <div className="container-fluid customer">
                <div className="container text-center py-1">
                    <h3 className="text-white display-6 mb-4">Event Slots</h3>
                </div>
            </div>

            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Slots for Event #{id}</h2>
                    <button className="btn btn-primary my-3" onClick={openAddSlotModal}>
                        Add Slots
                    </button>
                </div>

                <div className="card shadow-sm rounded-4">
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Capacity</th>
                                    <th>Available</th>
                                </tr>
                            </thead>

                            <tbody>
                                {!loading && slots.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            No slots found
                                        </td>
                                    </tr>
                                )}

                                {slots.map(slot => (
                                    <tr key={slot.id}>
                                        <td>{slot.id}</td>
                                        <td>{new Date(slot.start_time).toLocaleString()}</td>
                                        <td>{new Date(slot.end_time).toLocaleString()}</td>
                                        <td>{slot.max_capacity}</td>
                                        <td>{slot.available_slots}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {loading && <div className="text-center py-3">Loading...</div>}
                </div>
            </div>

            {/* --------------------- ADD SLOT MODAL --------------------- */}
            <div className="modal fade" id="slotModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content rounded-4 p-3">
                        <div className="modal-header border-0">
                            <h5>Add Time Slots</h5>
                            <button className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            {dateSlots.map((slot, dateIndex) => (
                                <div key={dateIndex} className="border rounded p-3 mb-3">
                                    <label className="fw-semibold">Date</label>
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        value={slot.date}
                                        onChange={e => {
                                            const updated = [...dateSlots];
                                            updated[dateIndex].date = e.target.value;
                                            setDateSlots(updated);
                                        }}
                                    />

                                    {slot.time_ranges.map((range, timeIndex) => (
                                        <div key={timeIndex} className="d-flex gap-2 mb-2">
                                            <input
                                                type="time"
                                                className="form-control"
                                                value={range.start_time}
                                                onChange={e =>
                                                    handleSlotChange(dateIndex, timeIndex, "start_time", e.target.value)
                                                }
                                            />
                                            <input
                                                type="time"
                                                className="form-control"
                                                value={range.end_time}
                                                onChange={e =>
                                                    handleSlotChange(dateIndex, timeIndex, "end_time", e.target.value)
                                                }
                                            />
                                        </div>
                                    ))}

                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => addTimeRange(dateIndex)}
                                    >
                                        Add Time Range
                                    </button>
                                </div>
                            ))}

                            <button className="btn btn-sm btn-success" onClick={addDateSlot}>
                                Add Date Slot
                            </button>
                        </div>

                        <div className="modal-footer border-0">
                            <button className="btn btn-primary w-100" onClick={submitTimeSlots}>
                                Submit Slots
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EventSlots;
