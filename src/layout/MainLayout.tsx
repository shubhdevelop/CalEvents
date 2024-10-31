// import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    return (
        <>
            <div className="w-full h-6 bg-red-50"> Navbar</div>
            <div className={`h-[calc(100vh-80px)]`}>
                <Outlet />
            </div>
            {/* <Footer /> */}
        </>
    );
}

export default MainLayout;
