import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import SideBar from "./SideBar"

const Layout = () => {
    return (
        <>
        <Header/>
        <SideBar />
        <main>
            <Outlet/>
        </main>
        <Footer/>
        
        </>

    )
}

export default Layout