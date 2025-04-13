import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '../../../contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import CustomButton from '../../CustomComponents/CustomButton'
import { useAuth } from '../../../contexts/AuthContext'
import { PERMISSIONS } from '../../../constants'
import AddEmployees from './AddEmployees'

import getAllEmployeesService from '../../../services/getAllEmployeesService'
import ViewIcon from '@/icons/ViewIcon'
import ViewEditEmployeeDetails from './ViewEditEmployeeDetails'
const ViewEmployees = () => {
    const { width } = useWidth()
    const { permissions, checkPermission } = useAuth()

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'id', headerName: 'Employee ID', width: 150},
      { field: 'first_name', headerName: 'First Name', width: 150 },
      { field: 'last_name', headerName: 'Last Name', width: 150 },
      { field: 'email', headerName: 'Email', width: 250},
      { field: 'mobile', headerName: 'Mobile', width:150},
      { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => {
        const [viewEditEmployeeDetailPopupOpen, setViewEditEmployeeDetailPopupOpen] = useState(false)
        const handleViewEditEmployeeDetailPopup = () => {
          setViewEditEmployeeDetailPopupOpen((prev)=>!prev)
        }
        const handleViewEditEmployeeDetailEvent = () => {
          setViewEditEmployeeDetailPopupOpen(false)
          // showAllEmployees()
        }

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {checkPermission(PERMISSIONS.UPDATE_ROLE) && <ViewIcon onClick={handleViewEditEmployeeDetailPopup} />}
          
        </Box>
        <ViewEditEmployeeDetails open={viewEditEmployeeDetailPopupOpen} onClose={handleViewEditEmployeeDetailPopup} onSubmit={handleViewEditEmployeeDetailEvent} employeeId={params?.id}  />
        </>
      )
    }
      },
      { field: 'createdAt', headerName: 'Created At', width: 300 },
      { field: 'updatedAt', headerName: 'Updated At', width: 300 }
    ]

    const columns = useMemo(() => {
      return allColumns.filter((col) => {
        if (col.field === "action" && !checkPermission(PERMISSIONS.AUDIT_JOINUS)) return false;
        return true;
      });
    }, [permissions]);

    
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([])
    const [employeeNameSearch, setEmployeeNameSearch] = useState('')
    const [addEmployeePopupOpen, setAddEmployeePopupOpen] = useState(false)

    const handleAddEmployeePopup = () => {
      setAddEmployeePopupOpen((prev)=>!prev)
    }

    const handleAddEmployeeEvent = () => {
      setAddEmployeePopupOpen(false)
      showAllEmployees()
    }

    const showAllEmployees = async () => {
      try{
        const employees = await getAllEmployeesService()
        setRows(employees)
      } catch(error){
        console.error(error)
        toast.error('Failed to fetch employees')
      }
    }
    useEffect(()=> {
      showAllEmployees()
    },[])

    useEffect(()=>{
      setEmployeeNameSearch('')
      setFilteredRows(rows)
    },[rows])

    useEffect(()=>{
      setFilteredRows(rows.filter(row => {
        const employee_name = row?.first_name + (row?.last_name ? ' ' + row?.last_name : '');
        return employee_name.toLowerCase().includes(employeeNameSearch.toLowerCase())
      }))
    },[employeeNameSearch])
  return (
    <Box className="p-4">
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box>
          <TextField
            size='small'
            placeholder="Search By Employee Name"
            value={employeeNameSearch}
            onChange={(e)=>setEmployeeNameSearch(e.target.value)}
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
            onClick={handleAddEmployeePopup}
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
      <AddEmployees open={addEmployeePopupOpen} onClose={handleAddEmployeePopup} onSubmit={handleAddEmployeeEvent} />
    </Box>
  )
}

export default ViewEmployees
