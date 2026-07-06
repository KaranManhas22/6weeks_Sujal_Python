import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";


function ManageEvent() {
    const initialState = {
        title: "",
        description: "",
        capacity: "",
        start_time: "",
        end_time: ""
    };

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    // ----------------- Time Slots -----------------
    const [dateSlots, setDateSlots] = useState([
        { date: "", time_ranges: [{ start_time: "", end_time: "" }] }
    ]);
    const [selectedEventId, setSelectedEventId] = useState(null);

    // ----------------------- Handle Input Change -----------------------
    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        let newErrors = {};
        Object.keys(formData).forEach(key => {
            if (!formData[key]) newErrors[key] = `${key.replace("_", " ")} is required`;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            let res;
            if (isEdit) {
                res = await APIService.updateEvent(formData, editId);
                res.data.success ? toast.success("Event Updated Successfully") : toast.error("Failed to update event");
            } else {
                let data = { ...formData };
                let userData = JSON.parse(sessionStorage.getItem('userData'));
                data.created_by = userData?.id;
                res = await APIService.addEvent(data);
                res.data.success ? toast.success("Event Added Successfully") : toast.error("Failed to add event");
            }

            getAllEvents();
            const modal = window.bootstrap.Modal.getInstance(document.getElementById("addEventModal"));
            modal.hide();
            setFormData(initialState);
            setIsEdit(false);
            setEditId(null);
            setErrors({});
        } catch (error) {
            console.log(error);
            toast.error("Server Error");
        }
    };

    const getAllEvents = () => {
        setLoading(true);
        APIService.getAllEvents()
            .then(res => { setData(res.data.data || []); setLoading(false); })
            .catch(err => { console.log(err); setLoading(false); });
    };

    useEffect(() => { getAllEvents(); }, []);

    const openDeleteModal = event => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then(async result => {
            if (result.isConfirmed) {
                const res = await APIService.deleteEvent(event.id);
                res.data.success ? toast.success("Event Deleted Successfully") : toast.error("Failed to delete event");
                getAllEvents();
            }
        });
    };

    const openEditModal = event => {
        setIsEdit(true);
        setEditId(event.id);
        setFormData({
            title: event.title,
            description: event.description,
            capacity: event.capacity,
            start_time: event.start_time,
            end_time: event.end_time
        });
        new window.bootstrap.Modal(document.getElementById("addEventModal")).show();
    };

    const openAddModal = () => {
        setIsEdit(false);
        setEditId(null);
        setFormData(initialState);
        setErrors({});
        new window.bootstrap.Modal(document.getElementById("addEventModal")).show();
    };

    // ----------------------- Time Slots Handlers -----------------------
    const handleSlotChange = (dateIndex, timeIndex, field, value) => {
        const updatedSlots = [...dateSlots];
        updatedSlots[dateIndex].time_ranges[timeIndex][field] = value;
        setDateSlots(updatedSlots);
    };

    const addDateSlot = () => setDateSlots([...dateSlots, { date: "", time_ranges: [{ start_time: "", end_time: "" }] }]);
    const addTimeRange = (dateIndex) => {
        const updatedSlots = [...dateSlots];
        updatedSlots[dateIndex].time_ranges.push({ start_time: "", end_time: "" });
        setDateSlots(updatedSlots);
    };
    const removeTimeRange = (dateIndex, timeIndex) => {
        const updatedSlots = [...dateSlots];
        updatedSlots[dateIndex].time_ranges.splice(timeIndex, 1);
        setDateSlots(updatedSlots);
    };
    const removeDateSlot = (dateIndex) => {
        const updatedSlots = [...dateSlots];
        updatedSlots.splice(dateIndex, 1);
        setDateSlots(updatedSlots);
    };

    const openTimeSlotModal = (eventId) => {
        setSelectedEventId(eventId);
        setDateSlots([{ date: "", time_ranges: [{ start_time: "", end_time: "" }] }]);
        new window.bootstrap.Modal(document.getElementById("timeSlotModal")).show();
    };

    const submitTimeSlots = async () => {
        try {
            if (!selectedEventId) return toast.error("No event selected");
            const payload = { date_slots: dateSlots };
            console.log("Selected Event Id: ", selectedEventId)
            const res = await APIService.addTimeSlots(selectedEventId, payload); // API call to /events/{id}/bulk-slots-flexible
            res.data.success ? toast.success(res.data.message) : toast.error("Failed to add time slots");
            setDateSlots([{ date: "", time_ranges: [{ start_time: "", end_time: "" }] }]);
            new window.bootstrap.Modal(document.getElementById("timeSlotModal")).hide();
        } catch (error) {
            console.log(error);
            toast.error("Server Error");
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="container-fluid customer">
                <div className="container text-center py-1">
                    <h3 className="text-white display-6 mb-4">Manage Events</h3>
                </div>
            </div>

            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Events</h2>
                    <Fab size="small" color="primary" aria-label="add" onClick={openAddModal}>
                        <AddIcon />
                    </Fab>
                </div>

                <div className="card border-0 shadow-sm rounded-4">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Capacity</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && data.length === 0 && (
                                    <tr><td colSpan="7" className="text-center py-4 text-muted">No events found</td></tr>
                                )}

                                {!loading && data.map(event => (
                                    <tr key={event.id}>
                                        <td>{event.id}</td>
                                        <td className="fw-semibold">{event.title}</td>
                                        <td className="text-muted small">{event.description}</td>
                                        <td>{event.capacity}</td>
                                        <td>{new Date(event.start_time).toLocaleString()}</td>
                                        <td>{new Date(event.end_time).toLocaleString()}</td>
                                        <td className="text-end">
                                            <div className="d-inline-flex gap-2">
                                                <button className="btn btn-sm btn-outline-secondary rounded-pill px-2" onClick={() => openEditModal(event)}>
                                                    <i className="bi bi-pencil-fill"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger rounded-pill px-2" onClick={() => openDeleteModal(event)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-info rounded-pill px-2"
                                                    onClick={() => navigate(`${event.id}/slots`)}
                                                >
                                                    Slots
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {loading && <div className="text-center py-4 text-muted">Loading events...</div>}
                </div>
            </div>

            {/* Add/Edit Event Modal */}
            <div className="modal fade" id="addEventModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-semibold">{isEdit ? "Update Event" : "Add Event"}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>
                        <div className="modal-body pt-3">
                            <div className="row g-3">
                                {Object.keys(formData).map(key => (
                                    <div className="col-md-6" key={key}>
                                        <label className="form-label small fw-semibold">{key.replace("_", " ").toUpperCase()}</label>
                                        <input
                                            type={key === "capacity" ? "number" : key.includes("time") ? "datetime-local" : "text"}
                                            name={key}
                                            value={formData[key]}
                                            className={`form-control rounded-3 ${errors[key] ? "is-invalid" : ""}`}
                                            onChange={handleChange}
                                        />
                                        {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer border-0">
                            <button className="btn btn-primary w-100 rounded-pill" onClick={handleSubmit}>{isEdit ? "Update Event" : "Add Event"}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Slot Modal */}
            <div className="modal fade" id="timeSlotModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-semibold">Add Time Slots</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>

                        <div className="modal-body pt-3">
                            {dateSlots.map((slot, dateIndex) => (
                                <div key={dateIndex} className="mb-3 border p-3 rounded">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label fw-semibold">Date</label>
                                        <button className="btn btn-sm btn-danger" onClick={() => removeDateSlot(dateIndex)}>Remove Date</button>
                                    </div>
                                    <input type="date" className="form-control mb-2" value={slot.date}
                                        onChange={(e) => {
                                            const updatedSlots = [...dateSlots];
                                            updatedSlots[dateIndex].date = e.target.value;
                                            setDateSlots(updatedSlots);
                                        }}
                                    />
                                    {slot.time_ranges.map((range, timeIndex) => (
                                        <div key={timeIndex} className="d-flex gap-2 align-items-center mb-2">
                                            <input type="time" className="form-control" value={range.start_time} onChange={(e) => handleSlotChange(dateIndex, timeIndex, "start_time", e.target.value)} />
                                            <input type="time" className="form-control" value={range.end_time} onChange={(e) => handleSlotChange(dateIndex, timeIndex, "end_time", e.target.value)} />
                                            <button className="btn btn-sm btn-danger" onClick={() => removeTimeRange(dateIndex, timeIndex)}>Remove</button>
                                        </div>
                                    ))}
                                    <button className="btn btn-sm btn-primary" onClick={() => addTimeRange(dateIndex)}>Add Time Range</button>
                                </div>
                            ))}
                            <button className="btn btn-sm btn-success" onClick={addDateSlot}>Add Date Slot</button>
                        </div>

                        <div className="modal-footer border-0">
                            <button className="btn btn-primary w-100 rounded-pill" onClick={submitTimeSlots}>Submit Time Slots</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageEvent;
