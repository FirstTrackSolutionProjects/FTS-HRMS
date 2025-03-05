import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '../../../contexts/WidthContext'
import { useEffect, useState } from 'react'
import getAllRoles from '../../../services/getAllRoles'
import CustomButton from '../../CustomComponents/CustomButton'
const ViewRoles = () => {
    const { width } = useWidth()
    const [roleName, setRoleName] = useState('')

    const columns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'role_id', headerName: 'ID', width: 100 },
      { field: 'role_name', headerName: 'Role Name', width: 150 },
      { field: 'createdAt', headerName: 'Created At', width: 300 },
      { field: 'updatedAt', headerName: 'Updated At', width: 300 }
    ]
    
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([])

    const showAllRoles = async () => {
      const roles = await getAllRoles()
      setRows(roles)
    }
    useEffect(()=> {
      showAllRoles()
    },[])

    useEffect(()=>{
      setRoleName('')
      setFilteredRows(rows)
    },[rows])

    useEffect(()=>{
      setFilteredRows(rows.filter(row => row.role_name.toLowerCase().includes(roleName.toLowerCase())))
    },[roleName])
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
            value={roleName}
            onChange={(e)=>setRoleName(e.target.value)}
            sx={{
              width: Math.min(width*0.55,400)
            }}
          />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          flex: 1
        }}>
          <CustomButton 
            sx={{
              marginY: 1
            }}
            title="ADD"
          />
        </Box>
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row?.role_id}
        pageSizeOptions={[5,10,15]}
        disableRowSelectionOnClick
        sx={{
            fontSize: Math.max(width/100, 15)
        }}
      />
    </Box>
  )
}

export default ViewRoles
