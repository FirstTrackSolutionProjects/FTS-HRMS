import { Box } from "@mui/material"
import { useAuth } from "../contexts/AuthContext"
const NotFound = () => {
  const {logout} = useAuth();
  return (
    <Box onClick={()=>logout()}>
        Not Found
    </Box>
  )
}

export default NotFound
