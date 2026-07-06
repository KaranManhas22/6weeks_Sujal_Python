import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function checkAdmin(){
    const nav = useNavigate()
    if(!sessionStorage.getItem("token") && !sessionStorage.getItem("userType")==1){
        toast.error("Please Login First")
        nav("/login")

    }

}
