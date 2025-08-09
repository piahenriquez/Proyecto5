import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { Box } from '@mui/material'

const Layout = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
        >
            <Header/>
            
            <Box 
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4,
                    px: 2
                }}
            >
                <Outlet/>
            </Box>
            
            <Footer/>
        </Box>
    )
}

export default Layout