import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import APIService from "../APIService";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";

export default function ManageCustomer() {
    const initialState = {
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postal_code: ""
    };

    const [data, setData] = useState([]);
    const [del, setdel] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    // ---------------- Input Change ----------------
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

    // ---------------- Validation ----------------
    const validate = () => {
        let newErrors = {};

        Object.keys(formData).forEach(key => {
            if (!formData[key].trim()) {
                newErrors[key] = `${key.replace("_", " ")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ---------------- Submit ----------------
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            let res;
            if (isEdit) {
                res = await APIService.updateUser(formData, editId);
                res.data.success
                    ? toast.success("User Updated Successfully")
                    : toast.error("Failed to update user");
            } else {
                res = await APIService.addUser(formData);
                res.data.success
                    ? toast.success("User Added Successfully")
                    : toast.error("Failed to add user");
            }

            getAllUsers();

            const modal = window.bootstrap.Modal.getInstance(
                document.getElementById("addUserModal")
            );
            modal.hide();

            setFormData(initialState);
            setErrors({});
            setIsEdit(false);
            setEditId(null);
        } catch (error) {
            console.log(error);
            toast.error("Server error");
        }
    };

    // ---------------- Get Users ----------------
    function getAllUsers() {
        setdel(true);
        APIService.getAllUsers()
            .then(res => {
                setData(res.data.data);
                setdel(false);
            })
            .catch(err => {
                console.log("error is", err);
                setdel(false);
            });
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    // ---------------- Delete ----------------
    const openDeleteModal = user => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel"
        }).then(async result => {
            if (result.isConfirmed) {
                const res = await APIService.deleteUser(user.id);
                res.data.success
                    ? toast.success("User Deleted Successfully")
                    : toast.error("User Deletion Failed");

                getAllUsers();
            }
        });
    };

    // ---------------- Edit ----------------
    const openEditModal = user => {
        setIsEdit(true);
        setEditId(user.id);

        setFormData({
            username: user.username,
            email: user.email,
            password: "",
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            address: user.address,
            city: user.city,
            country: user.country,
            postal_code: user.postal_code
        });

        const modal = new window.bootstrap.Modal(
            document.getElementById("addUserModal")
        );
        modal.show();
    };

    // ---------------- Add ----------------
    const openAddModal = () => {
        setIsEdit(false);
        setEditId(null);
        setFormData(initialState);
        setErrors({});

        const modal = new window.bootstrap.Modal(
            document.getElementById("addUserModal")
        );
        modal.show();
    };

    return (
        <>
            <>
                {/* Header Start */}
                <div className="container-fluid customer">
                    <div
                        className="container text-center py-1"
                        style={{ maxWidth: 900 }}
                    >
                        <h3 className="text-white display-6 mb-4">
                            Manage Users
                        </h3>
                    </div>
                </div>
                {/* Header End */}
            </>
            <ToastContainer />


            {/* Page Header */}
            <div className="container py-4" style={{ maxWidth: 1250 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Users</h2>
                        <Fab size="small" color="primary" aria-label="add" onClick={openAddModal}>
                            <AddIcon />
                        </Fab>
                </div>

                {/* Table Card */}
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>City</th>
                                    <th>Country</th>
                                    <th>Postal</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {del && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-5">
                                            <ClipLoader size={40} />
                                        </td>
                                    </tr>
                                )}

                                {!del && data.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-4 text-muted">
                                            No users found
                                        </td>
                                    </tr>
                                )}

                                {!del &&
                                    data.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td className="fw-semibold">{user.username}</td>
                                            <td>
                                                {user.first_name} {user.last_name}
                                            </td>
                                            <td>{user.phone}</td>
                                            <td>{user.city}</td>
                                            <td>{user.country}</td>
                                            <td>{user.postal_code}</td>
                                            <td className="text-end">
                                                <div className="d-inline-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary rounded-pill px-2"
                                                        onClick={() => openEditModal(user)}
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger rounded-pill px-2"
                                                        onClick={() => openDeleteModal(user)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>


                                                      <button className="btn text-success btn-sm btn-outline-success rounded-pill px-2" onClick={() => (user)}>
                                                        <Link to={'/admin/notifications/'+user.email}>
                                                                <i className="bi bi-envelope"></i>
                                                        </Link>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ---------------- Modal ---------------- */}
            <div className="modal fade" id="addUserModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 rounded-4 shadow">

                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-semibold">
                                {isEdit ? "Update User" : "Add User"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" />
                        </div>

                        <div className="modal-body pt-3">
                            <div className="row g-3">
                                {Object.keys(formData).map(key => (
                                    <div className="col-md-6" key={key}>
                                        <label className="form-label small fw-semibold">
                                            {key.replace("_", " ").toUpperCase()}
                                        </label>

                                        <input
                                            type={key === "password" ? "password" : "text"}
                                            name={key}
                                            value={formData[key]}
                                            className={`form-control rounded-3 ${errors[key] ? "is-invalid" : ""
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

                        <div className="modal-footer border-0">
                            <button
                                className="btn btn-primary w-100 rounded-pill"
                                onClick={handleSubmit}
                            >
                                {isEdit ? "Update User" : "Add User"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}