import { Outlet } from "react-router-dom";
import AdminHeader from "../adminLayout/AdminHeader";
import AdminFooter from "../adminLayout/AdminFooter";
export default function AdminMaster() {
    return (
        <>
            <AdminHeader></AdminHeader>
            <Outlet></Outlet>
            <AdminFooter></AdminFooter>
        </>
    )
}