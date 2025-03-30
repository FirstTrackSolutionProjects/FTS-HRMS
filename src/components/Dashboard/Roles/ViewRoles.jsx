import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '../../../contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import getAllRolesService from '../../../services/getAllRolesService'
import CustomButton from '../../CustomComponents/CustomButton'
import AddRoles from './AddRoles'
import { useAuth } from '../../../contexts/AuthContext'
import { PERMISSIONS } from '../../../constants'
import EditIcon from '../../../icons/EditIcon'
import PermissionIcon from '../../../icons/PermissionIcon'
import DeleteIcon from '../../../icons/DeleteIcon'
import UpdateRole from './UpdateRole'
import ManagePermissionsPopup from './ManagePermissionsPopup'
import DeleteRoleConfirmationPopup from './DeleteRoleConfirmPopup'
const ViewRoles = () => {
    const { width } = useWidth()
    const { permissions, checkPermission, getPermissions } = useAuth()

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'name', headerName: 'Role Name', width: 150 },
      { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => {
        const [updateRolePopupOpen, setUpdateRolePopupOpen] = useState(false)
        const handleUpdateRolePopup = () => {
          setUpdateRolePopupOpen((prev)=>!prev)
        }
        const handleUpdateRoleEvent = () => {
          setUpdateRolePopupOpen(false)
          getAllRoles()
        }

        const [managePermissionsPopupOpen, setManagePermissionsPopupOpen] = useState(false)
        const handleManagePermissionsPopup = () => {
          setManagePermissionsPopupOpen((prev)=>!prev)
        }
        const handleRolePermissionUpdateEvent = () => {
          setManagePermissionsPopupOpen(false)
          getPermissions()
        }

        const [deleteRolePopupOpen, setDeleteRolePopupOpen] = useState(false)
        const handleDeleteRolePopup = () => {
          setDeleteRolePopupOpen((prev)=>!prev)
        }
        const handleDeleteRoleEvent = () => {
          setUpdateRolePopupOpen(false)
          getAllRoles()
        }

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {checkPermission(PERMISSIONS.UPDATE_ROLE) && <EditIcon onClick={handleUpdateRolePopup} />}
          {checkPermission(PERMISSIONS.UPDATE_ROLE) && <PermissionIcon onClick={handleManagePermissionsPopup} />}
          {checkPermission(PERMISSIONS.DELETE_ROLE) && <DeleteIcon onClick={handleDeleteRolePopup} />}
        </Box>
        <UpdateRole open={updateRolePopupOpen} onClose={handleUpdateRolePopup} onSubmit={handleUpdateRoleEvent} roleId={params?.id}  />
        <ManagePermissionsPopup open={managePermissionsPopupOpen} onSubmit={handleRolePermissionUpdateEvent} onClose={handleManagePermissionsPopup} roleId={params?.id} />
        <DeleteRoleConfirmationPopup open={deleteRolePopupOpen} onClose={handleDeleteRolePopup} onSubmit={handleDeleteRoleEvent} roleId={params?.id} />
        </>
      )}
      },
      { field: 'createdAt', headerName: 'Created At', width: 300 },
      { field: 'updatedAt', headerName: 'Updated At', width: 300 }
    ]

    const columns = useMemo(() => {
      return allColumns.filter((col) => {
        if (col.field === "action" && !checkPermission(PERMISSIONS.UPDATE_ROLE)) return false;
        return true;
      });
    }, [permissions]);

    
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([])
    const [roleNameSearch, setRoleNameSearch] = useState('')
    const [addRolePopupOpen, setAddRolePopupOpen] = useState(false)

    const handleAddRolePopup = () => {
      setAddRolePopupOpen((prev)=>!prev)
    }

    const handleAddRoleEvent = () => {
      setAddRolePopupOpen(false)
      getAllRoles()
    }

    const getAllRoles = async () => {
      const roles = await getAllRolesService()
      setRows(roles)
    }
    useEffect(()=> {
      getAllRoles()
    },[])

    useEffect(()=>{
      setRoleNameSearch('')
      setFilteredRows(rows)
    },[rows])

    useEffect(()=>{
      setFilteredRows(rows.filter(row => row.name.toLowerCase().includes(roleNameSearch.toLowerCase())))
    },[roleNameSearch])
  return (
    <Box className="p-4">
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box>
          <TextField
            size='small'
            placeholder="Search By Role Name"
            value={roleNameSearch}
            onChange={(e)=>setRoleNameSearch(e.target.value)}
            sx={{
              width: Math.min(width*0.55,400)
            }}
          />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
          alignItems: 'center',
          flex: 1
        }}>
          <CustomButton 
            sx={{
              marginY: 1
            }}
            title="ADD"
            onClick={handleAddRolePopup}
          />
        </Box>
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSizeOptions={[5,10,15]}
        disableRowSelectionOnClick
        sx={{
            fontSize: Math.max(width/100, 15)
        }}
      />
      <AddRoles open={addRolePopupOpen} onClose={handleAddRolePopup} onSubmit={handleAddRoleEvent} />
    </Box>
  )
}

export default ViewRoles
