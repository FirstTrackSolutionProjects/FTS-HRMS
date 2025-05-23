import { Box, TextField } from "@mui/material"
import Popup from "@/components/CustomComponents/Popup"
import CustomButton from "@/components/CustomComponents/CustomButton"
import createRoleService from "@/services/createRoleService"
import { toast } from "react-toastify"
import { useState } from "react"
const AddRoles = ({open, onClose, onSubmit}) => {
    const [roleName, setRoleName] = useState("")
    const handleSubmit = async () => {
        try {
            await createRoleService(roleName)
            toast.success("Role created successfully")
            onSubmit()
            setRoleName("")
        } catch (error) {
            console.error(error)
            toast.error("Failed to create role")
        }
    }
  return (
    <Popup
        open={open}
        close={onClose}
        title="Add Role"
    >
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
        <TextField
            size="small"
            label="Role Name"
            variant="outlined" 
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            sx={{
                width : 300
            }}
        />
        <CustomButton
        title="Create"
        variant="contained"
        color="primary"
        size="small"
        onClick={handleSubmit}
        sx={{
            marginTop : 2,
            width : 300
        }}
        />
        </Box>
    </Popup>
  )
}

export default AddRoles
