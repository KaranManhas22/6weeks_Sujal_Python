import axios from "axios";

// export const BASE_URL = "http://192.168.1.6:8000/";
export const BASE_URL = "http://localhost:8000/";

class APIService {

    getToken() {
        let obj = {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
        return obj
    }

    AdminLogin(data) {
        return axios.post(BASE_URL + "login", data)
    }


    CustomerRegister(data) {
        return axios.post(BASE_URL + "customer/customer/add", data)
    }


    AllServices(data) {
        return axios.post(BASE_URL + "service/service/all", data)
    }


    Login(data) {
        return axios.post(BASE_URL + "login", data);
    }

    getAllUsers(data) {
        return axios.post(BASE_URL + "users", data, { headers: this.getToken() });
    }

    deleteUser(id) {
        return axios.delete(BASE_URL + "users/" + id, { headers: this.getToken() });
    }

    singleUser(id) {
        return axios.post(BASE_URL + "users/" + id, {}, { headers: this.getToken() });
    }

    updateUser(data, id) {
        return axios.put(BASE_URL + "users/" + id, data, { headers: this.getToken() });
    }

    addUser(data) {
        return axios.post(BASE_URL + "register", data);
    }


    // CREATE Event
    addEvent(data) {
        return axios.post(BASE_URL + "events", data, { headers: this.getToken() });
    }

    getAllEvents(data) {
        return axios.post(BASE_URL + "all_events", data, { headers: this.getToken() });
    }


    deleteEvent(id) {
        return axios.delete(BASE_URL + "events/" + id, { headers: this.getToken() })
    }

    updateEvent(data, id) {
        return axios.put(BASE_URL + "events/" + id, data, { headers: this.getToken() })
    }


    // BOOKING START
    getMyBooking(data) {
        return axios.post(BASE_URL + "bookings/my-bookings", data, { headers: this.getToken() })
    }

    getBookingTrends(period) {
        return axios.get(
            `${BASE_URL}admin/charts/booking-trends`,
            {
                params: { period },
                headers: this.getToken()
            }
        );
    }


    getAllBooking() {
        return axios.get(BASE_URL + "admin/bookings/all", {
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        })
    }

    getBookingsByEvent(id) {
        return axios.get(BASE_URL + "admin/bookings/event/" + id, {
            headers: this.getToken()
        }
        );
    }


    createBooking(data) {
        return axios.post(BASE_URL + "bookings", data, { headers: this.getToken() })
    }

    getAllTimeSlots(data) {
        return axios.post(BASE_URL)
    }

    updateBookingStatus(id, data) {
        return axios.put(BASE_URL + "bookings/" + id, data, { headers: this.getToken() })
    }

    addTimeSlots(id, data) {
        return axios.post(BASE_URL + "events/" + id + "/bulk-slots-flexible", data, { headers: this.getToken() })
    }

    getAvailableSlots(id) {
        return axios.post(BASE_URL + "events/" + id + "/slots")
    }

    //ANALYTICS
    getBookingTrends(period) {
        return axios.get(BASE_URL + `admin/charts/booking-trends`, {
            params: { period },
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        });
    }

    getEventPopularity(limit = 10) {
        return axios.get(BASE_URL + `admin/charts/event-popularity`, {
            params: { limit },
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        });
    }

    getBookingStatus() {
        return axios.get(BASE_URL + `admin/charts/booking-status`, {
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        });
    }

    getPeakHours() {
        return axios.get(BASE_URL + `admin/charts/peak-hours`, {
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        });
    }
    getAiPerformance() {
        return axios.get(BASE_URL + `admin/charts/ai-performance`, {
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        });
    }

    getCapacityUtilization() {
        return axios.get(BASE_URL + `admin/charts/capacity-utilization`, {
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        });
    }

    getUserRegistration() {
        return axios.get(BASE_URL + `admin/charts/user-registration`, {
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        });
    }

    getSlotDemands(eventId) {
        return axios.get(BASE_URL + `api/recommend/event/${eventId}`,
            {
                headers: {
                    ...this.getToken(),
                    "ngrok-skip-browser-warning": "true"
            }
            }
        );
    }

    sendEmail(data) {
        return axios.post(BASE_URL + "notifications/send-email", data, { headers: this.getToken() })
    }

    sendCancellation(data){
        return axios.post(BASE_URL + "notifications/send-cancellation", data, { headers: this.getToken() })
    }

    sendRemainder(data) {
        return axios.post(BASE_URL + "notifications/send-reminder", data, { headers: this.getToken() })
    }


    NotificationFetch(data) {
         return axios.get(BASE_URL + `notifications/history/${data}`, {
            headers: {
                ...this.getToken(),
                "ngrok-skip-browser-warning": "true"
            }
        });
    }

}
export default new APIService;