import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { Box } from '@mui/material'
import { ErrorBoundary } from "../ErrorBoundary"

const Layout = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                backgroundAttachment: 'fixed',
                
            }}
        >
            <Header/>
            
            <Box 
                component="main"
                sx={{
                    flexGrow: 1,
                }}
            >
                <ErrorBoundary>
                <Outlet/>
                </ErrorBoundary>
            </Box>
            
            <Footer/>
        </Box>
    )
}

export default Layout