import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '@/contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PERMISSIONS } from '@/constants'
import getEmployeesSchedulingService from '@/services/shiftServices/getEmployeesSchedulingService'
import EditIcon from '@/icons/EditIcon'
import AssignShiftPopup from './AssignShiftPopup'
// import ViewIcon from '@/icons/ViewIcon'
// import ViewEditEmployeeDetails from './ViewEditEmployeeDetails'
const ViewEmployeesSchedule = () => {
    const { width } = useWidth()
    const { permissions, checkPermission } = useAuth()

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'id', headerName: 'Employee ID', width: 150},
      { field: 'first_name', headerName: 'First Name', width: 150 },
      { field: 'last_name', headerName: 'Last Name', width: 150 },
			{ field: 'branch_name', headerName: 'Branch', width: 150 },
      { field: 'department_name', headerName: 'Department', width: 150 },
			{ field: 'process_name', headerName: 'Process', width: 150 },
			{ field: 'shift_name', headerName: 'Shift', width: 150 },
			{ field: 'batch_name', headerName: 'Batch', width: 150 },
      { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => {
        const [assignShiftPopupOpen, setAssignShiftPopupOpen] = useState(false)
        const handleAssignShiftPopup = () => {
          setAssignShiftPopupOpen((prev)=>!prev)
        }
        const handleAssignShiftEvent = () => {
          setAssignShiftPopupOpen(false)
          showAllEmployees()
        }

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {checkPermission(PERMISSIONS.UPDATE_ROLE) && <EditIcon onClick={handleAssignShiftPopup} />}
          
        </Box>
        <AssignShiftPopup open={assignShiftPopupOpen} onClose={handleAssignShiftPopup} onSubmit={handleAssignShiftEvent} employeeId={params?.id}  />
        </>
      )
    }
      },
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

    const showAllEmployees = async () => {
      try{
        const employees = await getEmployeesSchedulingService()
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
    </Box>
  )
}

export default ViewEmployeesSchedule
