import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import APIService from "../APIService";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Analytics() {
    const [activeTab, setActiveTab] = useState("trends");
    const [period, setPeriod] = useState("weekly");
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    // ---------- FETCH DATA ----------
    const fetchData = async () => {
        setLoading(true);
        try {
            let response;

            switch (activeTab) {
                case "trends":
                    response = await APIService.getBookingTrends(period);
                    setChartData(response.data?.data);
                    break;

                case "popularity":
                    response = await APIService.getEventPopularity(10);
                    setChartData(response.data?.data);
                    break;

                case "status":
                    response = await APIService.getBookingStatus();
                    setChartData(response.data?.data);
                    break;

                case "peak":
                    response = await APIService.getPeakHours();
                    setChartData(response.data?.data);
                    break;

                case "ai":
                    response = await APIService.getAiPerformance();
                    setChartData(response.data?.data);
                    break;

                case "capacity":
                    response = await APIService.getCapacityUtilization();
                    setChartData(response.data?.data);
                    break;

                case "activity":
                    response = await APIService.getUserRegistration();
                    setChartData(response.data?.data);
                    break;

                default:
                    setChartData(null);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load chart");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [activeTab, period]);

    // ---------- CHART RENDER ----------
    const renderChart = () => {
        if (!chartData) return null;

        switch (activeTab) {
            case "trends":
            case "peak":
            case "ai":
            case "activity":
                return <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } }} height={320} />;
            case "popularity":
            case "capacity":
                return <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } }} height={320} />;
            case "status":
                return <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } }} height={320} />;
            default:
                return null;
        }
    };

    return (
        <>
            <ToastContainer />

            <div className="container-fluid customer">
                <div className="container text-center py-1">
                    <h3 className="text-white display-6 mb-4">Booking Analytics</h3>
                </div>
            </div>

            <div className="container py-4">
                <div className="card shadow-sm rounded-4 p-4">
                    {/* -------- TABS -------- */}
                    <ul className="nav nav-tabs mb-3">
                        {[
                            { id: "trends", label: "Booking Trends" },
                            { id: "popularity", label: "Event Popularity" },
                            { id: "status", label: "Booking Status" },
                            { id: "peak", label: "Peak Hours" },
                            { id: "ai", label: "AI Performance" },
                            { id: "capacity", label: "Capacity Utilization" },
                            { id: "activity", label: "User Activity" },
                        ].map(tab => (
                            <li className="nav-item" key={tab.id}>
                                <button
                                    className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* -------- PERIOD TOGGLE FOR TABS THAT NEED IT -------- */}
                    {["trends"].includes(activeTab) && (
                        <div className="btn-group mb-3">
                            {["daily", "weekly", "monthly"].map(p => (
                                <button key={p} className={`btn btn-sm ${period === p ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setPeriod(p)}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* -------- CHART -------- */}
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ minHeight: "320px" }}>{renderChart()}</div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Analytics;
