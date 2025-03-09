import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '../../../contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import getAllRoles from '../../../services/getAllRoles'
import CustomButton from '../../CustomComponents/CustomButton'
import AddRoles from './AddRoles'
import { useAuth } from '../../../contexts/AuthContext'
import { PERMISSIONS } from '../../../constants'
import EditIcon from '../../../icons/EditIcon'
import PermissionIcon from '../../../icons/PermissionIcon'
import DeleteIcon from '../../../icons/DeleteIcon'
const ViewRoles = () => {
    const { width } = useWidth()
    const { permissions } = useAuth()
    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'role_id', headerName: 'ID', width: 100 },
      { field: 'role_name', headerName: 'Role Name', width: 150 },
      { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => (
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {permissions.includes(PERMISSIONS.UPDATE_ROLE) && <EditIcon onClick={()=>alert(1)} />}
          {permissions.includes(PERMISSIONS.UPDATE_ROLE) && <PermissionIcon onClick={()=>alert(1)} />}
          {permissions.includes(PERMISSIONS.DELETE_ROLE) && <DeleteIcon onClick={()=>alert(1)} />}
        </Box>
      ) },
      { field: 'createdAt', headerName: 'Created At', width: 300 },
      { field: 'updatedAt', headerName: 'Updated At', width: 300 }
    ]

    const columns = useMemo(() => {
      return allColumns.filter((col) => {
        if (col.field === "action" && !permissions.includes(PERMISSIONS.UPDATE_ROLE)) return false;
        return true;
      });
    }, [permissions]);

    
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([])
    const [roleNameSearch, setRoleNameSearch] = useState('')
    const [addRolePopupOpen, setAddRolePopupOpen] = useState(false)
    const [selectedRoleId, setSelectedRoleId] = useState(null)

    const handleAddRolePopup = () => {
      setAddRolePopupOpen((prev)=>!prev)
    }

    const handleAddRoleEvent = () => {
      setAddRolePopupOpen(false)
      showAllRoles()
    }

    const showAllRoles = async () => {
      const roles = await getAllRoles()
      setRows(roles)
    }
    useEffect(()=> {
      showAllRoles()
    },[])

    useEffect(()=>{
      setRoleNameSearch('')
      setFilteredRows(rows)
    },[rows])

    useEffect(()=>{
      setFilteredRows(rows.filter(row => row.role_name.toLowerCase().includes(roleNameSearch.toLowerCase())))
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
        getRowId={(row) => row?.role_id}
        pageSizeOptions={[5,10,15]}
        onRowSelectionModelChange={(value)=>{
            setSelectedRoleId(value[0])
        }}
        sx={{
            fontSize: Math.max(width/100, 15)
        }}
      />
      <AddRoles open={addRolePopupOpen} onClose={handleAddRolePopup} onSubmit={handleAddRoleEvent} />
    </Box>
  )
}

export default ViewRoles
