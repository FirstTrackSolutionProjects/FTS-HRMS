import { Box, TextField } from "@mui/material"
import Popup from "../../CustomComponents/Popup"
import CustomButton from "../../CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useState } from "react"
import updateRoleService from "../../../services/updateRoleService"
const UpdateRole = ({open, onClose, onSubmit, roleId}) => {
    const [roleName, setRoleName] = useState("")
    const handleSubmit = async () => {
        try {
            await updateRoleService(roleId, roleName)
            toast.success("Role updated successfully")
            onSubmit()
            setRoleName("")
        } catch (err) {
            toast.error("Failed to update role")
        }
    }
  return (
    <Popup
        open={open}
        close={onClose}
        title="Update Role"
    >
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
        <TextField
            size="small"
            label="New Role Name"
            variant="outlined" 
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            sx={{
                width : 300
            }}
        />
        <CustomButton
        title="Update"
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

export default UpdateRole
