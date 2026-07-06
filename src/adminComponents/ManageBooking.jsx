import React, { useEffect, useState } from "react";
import APIService from "../APIService";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

function ManageBooking() {
    const initialState = {
        title: "",
        description: "",
        capacity: "",
        duration_minutes: ""
    };

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    // ----------------------- Handle Input Change -----------------------
    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setErrors({
            ...errors,
            [e.target.name]: ""
        });
    };

    // ----------------------- Validate All Fields -----------------------
    const validate = () => {
        let newErrors = {};

        Object.keys(formData).forEach(key => {
            if (formData[key] === "" || formData[key] === null) {
                newErrors[key] = `${key.replace("_", " ")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ----------------------- Submit Form (Add / Edit) -----------------------
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            let res;

            if (isEdit) {
                res = await APIService.updateEvent(formData, editId);
                if (res.data.success)
                    toast.success("Event Updated Successfully");
                else toast.error("Failed to update event");
            } else {
                let data = formData;
                let userData = JSON.parse(sessionStorage.getItem('userData'));
                data.created_by = userData?.id;
                res = await APIService.addEvent(data);
                if (res.data.success) {
                    getAllEvents();
                    toast.success("Event Added Successfully")
                } else {
                    toast.error("Failed to add event");
                };
            }

            getAllEvents();

            const modal = window.bootstrap.Modal.getInstance(
                document.getElementById("addEventModal")
            );
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

    // ----------------------- Get All Events -----------------------
    const getAllBooking = () => {
        setLoading(true);

        APIService.getAllBooking()
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
        getAllBooking();
    }, []);

    // ----------------------- Delete Event Using SweetAlert -----------------------
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

                if (res.data.success) {
                    toast.success("Event Deleted Successfully");
                    getAllBooking();
                } else {
                    toast.error("Failed to delete event");
                }
            }
        });
    };

    // ----------------------- Open Edit Modal -----------------------
    const openEditModal = event => {
        setIsEdit(true);
        setEditId(event.id);

        setFormData({
            title: event.title,
            description: event.description,
            capacity: event.capacity,
            duration_minutes: event.duration_minutes
        });

        const modal = new window.bootstrap.Modal(
            document.getElementById("addEventModal")
        );
        modal.show();
    };

    // ----------------------- Open Add Modal -----------------------
    const openAddModal = () => {
        setIsEdit(false);
        setEditId(null);
        setFormData(initialState);
        setErrors({});

        const modal = new window.bootstrap.Modal(
            document.getElementById("addEventModal")
        );
        modal.show();
    };

    return (
        <>
            <ToastContainer />

            <div className="container-fluid customer">
                <div
                    className="container text-center py-1"
                    style={{ maxWidth: 900 }}
                >
                    <h3 className="text-white display-6 mb-4">Manage Bookings</h3>
                </div>
            </div>
            {/* Header */}
            <div className="p-2">
                <div className="card mt-4">
                    <div className="card-body">
                        {/* Event List */}
                        <div className="container-fluid mt-4">
                            <div className="d-flex justify-content-end mb-3">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={openAddModal}
                                >
                                    Create Booking
                                </button>
                            </div>

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Capacity</th>
                                        <th>Duration (min)</th>
                                        {/* <th>Action</th> */}
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                No Bookings Found
                                            </td>
                                        </tr>
                                    )}

                                    {data.map(event => (
                                        <tr key={event.id}>
                                            <td>{event.id}</td>
                                            <td>{event.title}</td>
                                            <td>{event.description}</td>
                                            <td>{event.capacity}</td>
                                            <td>{event.duration_minutes}</td>
                                            {/* <td>
                                                <div className="d-flex gap-2">
                                                    <button  className="btn btn-sm btn-secondary"  onClick={() => openEditModal(event) }> Edit </button>
                                                    <button className="btn btn-sm btn-danger"  onClick={() => openDeleteModal(event)  }> Delete </button>
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


            {/* Add / Edit Modal */}
            <div className="modal fade" id="addEventModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {isEdit ? "Update Event" : "Add Event"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            />
                        </div>

                        <div className="modal-body">
                            <div className="row g-3">
                                {Object.keys(formData).map(key => (
                                    <div className="col-md-6" key={key}>
                                        <label className="form-label">
                                            {key
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </label>

                                        <input
                                            type={
                                                key === "capacity" ||
                                                key === "duration_minutes"
                                                    ? "number"
                                                    : "text"
                                            }
                                            name={key}
                                            value={formData[key]}
                                            className={`form-control ${
                                                errors[key] ? "is-invalid" : ""
                                            }`}
                                            onChange={handleChange}
                                        />

                                        {errors[key] && (
                                            <div className="invalid-feedback">
                                                {errors[key]}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={handleSubmit}
                            >
                                {isEdit ? "Update Event" : "Add Event"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageBooking