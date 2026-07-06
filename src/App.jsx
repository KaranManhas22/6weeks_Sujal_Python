import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./adminComponents/Login";
import AdminMaster from "./masters/AdminMaster";
import ManageDashboard from "./adminComponents/ManageDashboard";
import ManageEvent from "./adminComponents/ManageEvent";
import ManageCustomer from "./adminComponents/ManageCustomer";
import ManageBooking from './adminComponents/ManageBooking';
import EventSlots from './adminComponents/EventSlots';
import UserMaster from './masters/UserMaster';
import UserDashboard from "./userComponents/UserDashboard";
import UserBookings from "./userComponents/UserBookings";
import UserNotification from "./userComponents/UserNotification";
import UserEvents from "./userComponents/UserEvents";
import UserEventSlots from "./userComponents/UserEventSlots";
import Bookings from "./adminComponents/Bookings";
import BookingAnalytics from "./adminComponents/BookingAnalytics";
import ProtectedRoute from "./auth/RouteGuard";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Login Routes */}
                    <Route path="" element={<Login />} />
                    <Route path="/login" element={<Login />} />

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute allowedUserTypes={["admin"]} />}>
                        <Route path="/admin" element={<AdminMaster />}>
                            <Route path="" element={<ManageDashboard />} />
                            <Route path="events" element={<ManageEvent />} />
                            <Route path="users" element={<ManageCustomer />} />
                            <Route path="bookings" element={<ManageBooking />} />
                            <Route path="bookings/all" element={<Bookings />} />
                            <Route path="bookings/:id" element={<Bookings />} />
                            <Route path="events/:id/slots" element={<EventSlots />} />
                            <Route path="booking/analytics" element={<BookingAnalytics />} />
                            <Route path="notifications/:email" element={<UserNotification />} />
                        </Route>
                    </Route>

                    {/* Users Routes */}
                    <Route element={<ProtectedRoute allowedUserTypes={["user"]} />}>
                        <Route path="/users" element={<UserMaster />}>
                            <Route path="" element={<UserDashboard />} />
                            <Route path="events" element={<UserEvents />} />
                            <Route path="bookings" element={<UserBookings />} />
                            <Route path="events/:id/slots" element={<UserEventSlots />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Login />} />

                </Routes>
            </BrowserRouter >
        </>
    );
}

export default App;