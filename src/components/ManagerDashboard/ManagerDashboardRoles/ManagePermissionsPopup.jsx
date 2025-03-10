import { Box, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import Popup from "../../CustomComponents/Popup";
import CustomButton from "../../CustomComponents/CustomButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import getRolePermissionsService from "../../../services/getRolePermissionsService";
import updateRolePermissionsService from "../../../services/updateRolePermissionsService";
import getPermissionsService from "../../../services/getPermissionsService";
import { useHeight } from "../../../contexts/HeightContext";

const ManagePermissionsPopup = ({ open, onClose, roleId }) => {
    if (!open) return null;
    const { height } = useHeight();
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        if (roleId) {
            fetchAllPermissions();
            fetchRolePermissions();
        }
    }, [roleId]);

    const fetchAllPermissions = async () => {
        try {
            const response = await getPermissionsService();
            if (response?.success) {
                setPermissions(response?.permissions);
            } else {
                toast.error("Failed to fetch all permissions.");
            }
        } catch (e) {
            toast.error(e);
        }
    };

    const fetchRolePermissions = async () => {
        try {
            const response = await getRolePermissionsService(roleId);
            if (response?.success) {
                setSelectedPermissions(response?.permissions?.map(p => p.permission_id) || []);
            } else {
                toast.error("Failed to fetch role permissions.");
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const handlePermissionChange = (permission) => {
        setSelectedPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    const handleSubmit = async () => {
        try {
            const response = await updateRolePermissionsService(roleId, selectedPermissions);
            if (response?.success) {
                toast.success("Permissions updated successfully!");
                onClose();
            } else {
                toast.error("Failed to update permissions.");
            }
        } catch (err) {
            toast.error("Error updating permissions.");
        }
    };

    return (
        <Popup open={open} close={onClose} title="Manage Role Permissions">
            <Box sx={{ display: "flex", flexDirection: "column", height: height*0.7, minHeight: 0, }}>
                {/* Scrollable area */}
                <Box sx={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", padding: 2}}>
                    <FormGroup>
                        {permissions.map((permission) => (
                            <FormControlLabel
                                key={permission?.permission_id}
                                control={
                                    <Checkbox
                                        checked={selectedPermissions.includes(permission?.permission_id)}
                                        onChange={() => handlePermissionChange(permission?.permission_id)}
                                    />
                                }
                                label={permission?.permission_name}
                            />
                        ))}
                    </FormGroup>
                </Box>

                {/* Sticky update button */}
                <Box sx={{ padding: 2, borderTop: "1px solid #ddd", background: "#fff"}}>
                    <CustomButton
                        title="Update Permissions"
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleSubmit}
                        sx={{ width: "100%" }}
                    />
                </Box>
            </Box>
        </Popup>
    );
};

export default ManagePermissionsPopup;
