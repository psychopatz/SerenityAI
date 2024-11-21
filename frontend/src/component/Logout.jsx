import { useEffect } from "react";
import StorageService from "../services/StorageService";

const Logout = () => {
    const storage = StorageService();
    useEffect(() => {
        storage.clearLocalStorage();
        storage.clearSessionStorage();
        window.location.href = "/login";
    })
    return ( 
        <>
        </>

     );
}
 
export default Logout;