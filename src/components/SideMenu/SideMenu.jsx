import { Box } from '@mui/material'
import { sidebarNavItems } from '@/constants'
import { Tooltip } from 'react-tooltip'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { useAuth } from '@/contexts/AuthContext';

const SideMenu = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const {checkPermission, is_superadmin} = useAuth()
  return (
    <Box className="h-screen w-full flex flex-col space-y-2 items-center" gap={4}>
        <Box component={'img'} className='w-16 h-16 rounded-full p-2' src='/logo.jpg' />
        <Box 
            className="h-[calc(100vh-210px)] w-full flex flex-col items-center overflow-y-auto overflow-x-hidden" 
            gap={2}
            sx={{
                "&::-webkit-scrollbar": {
                  width: "2px", // Width of the scrollbar
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f0f0f0", // Track color
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888", // Scrollbar thumb color
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#555", // Darker thumb on hover
                  },
                },
            }}
        >
            {sidebarNavItems.map((headerNavItems, index)=>{
                if (!is_superadmin && headerNavItems?.permissions?.length &&
                    !headerNavItems.permissions.every(p => checkPermission(p))
                  ) return;
                return (
                <>
                    <Box 
                        key={index} 
                        data-tooltip-id={headerNavItems.label} 
                        className={`relative min-w-10 w-10 min-h-10 h-10 flex items-center justify-center text-white text-2xl rounded-lg hover:bg-[rgba(255,255,255,0.4)] ${location.pathname.startsWith('/dashboard'+headerNavItems.to)?'bg-[rgba(255,255,255,0.5)]':'bg-[rgba(255,255,255,0.2)]'} cursor-pointer`}
                        onClick={()=>navigate('/dashboard'+headerNavItems.to.replace('/*',''))}
                    >
                        <headerNavItems.icon />
                    </Box>
                    <Tooltip
                        id={headerNavItems.label}
                        place="right"
                        className='z-50'
                        content={headerNavItems.label}
                    />
                </>
            )})}
        </Box>
        <Link to={'/dashboard/profile'} className={`w-11 h-11 flex justify-center items-center rounded-full bg-[rgba(255,255,255,0.3)] text-3xl text-white hover:bg-[rgba(255,255,255,0.4)] cursor-pointer`}>
            <CgProfile />
        </Link>
    </Box>
  )
}

export default SideMenu
