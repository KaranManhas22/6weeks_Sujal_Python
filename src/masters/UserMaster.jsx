import { Outlet } from "react-router-dom";
import AdminFooter from "../adminLayout/AdminFooter";
import UserHeader from "../userLayout/UserHeader";
export default function UserMaster() {
    return (
        <>
            <UserHeader></UserHeader>
            <Outlet></Outlet>
            <AdminFooter></AdminFooter>
        </>
    )
}