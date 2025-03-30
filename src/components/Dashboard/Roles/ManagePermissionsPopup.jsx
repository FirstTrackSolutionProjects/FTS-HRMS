import { Box, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import CustomButton from "../../CustomComponents/CustomButton";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import getRolePermissionsService from "../../../services/getRolePermissionsService";
import updateRolePermissionsService from "../../../services/updateRolePermissionsService";
import getPermissionsService from "../../../services/getPermissionsService";
import ActionPopup from "../../CustomComponents/ActionPopup";

const ManagePermissionsPopup = ({ open, onClose, onSubmit, roleId }) => {
    if (!open) return null;
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const popupRef = useRef()

    useEffect(() => {
        if (roleId) {
            fetchAllPermissions();
            fetchRolePermissions();
        }
    }, [roleId]);

    const fetchAllPermissions = async () => {
        try {
            const permissions = await getPermissionsService();
            setPermissions(permissions);
        } catch (error) {
            toast.error("Failed to fetch all permissions.");
        }
    };

    const fetchRolePermissions = async () => {
        try {
            const permissions = await getRolePermissionsService(roleId);
            setSelectedPermissions(permissions?.map(permission => permission.id) || []);
        } catch (error) {
            toast.error("Failed to fetch role permissions.");
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
            await updateRolePermissionsService(roleId, selectedPermissions);
            toast.success("Permissions updated successfully!");
            onSubmit()
        } catch (err) {
            toast.error("Failed to update permissions.");
        }
    };

    return (
        <ActionPopup open={open} onClose={onClose} title="Manage Role Permissions" ref={popupRef}
            actions={[
                             <CustomButton
                                title="Update Permissions"
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleSubmit}  
                            />
            ]}>
                        <Box sx={{ minHeight: 0, overflowY: "auto", padding: 2}}>
                            <FormGroup>
                                {permissions.map((permission) => (
                                    <FormControlLabel
                                        key={permission?.id}
                                        control={
                                            <Checkbox
                                                checked={selectedPermissions.includes(permission?.id)}
                                                onChange={() => handlePermissionChange(permission?.id)}
                                            />
                                        }
                                        label={permission?.name}
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                </ActionPopup>
        //         action={
        //             <>
        //                 <Box sx={{ padding: 1, borderTop: "1px solid #ddd", background: "#fff"}}>
        //                     <CustomButton
        //                         title="Update Permissions"
        //                         variant="contained"
        //                         color="primary"
        //                         size="small"
        //                         onClick={handleSubmit}
        //                         sx={{ width: "100%" }}
        //                     />
        //                 </Box>
        //             </>
        //         }
        //     />
        // </ActionPopup>
    );
};

export default ManagePermissionsPopup;
