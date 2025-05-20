import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '@/contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import CustomButton from '@/components/CustomComponents/CustomButton'
import { useAuth } from '@/contexts/AuthContext'
import { PERMISSIONS } from '@/constants'
import getShiftsService from '@/services/shiftServices/getShiftsService'
import getAllDepartmentsService from '@/services/getAllDepartmentsService'
import getDepartmentProcessesService from '@/services/getDepartmentProcessesService'
import AddShift from './AddShift'
import DeleteIcon from '@/icons/DeleteIcon'
import DeleteShiftConfirmationPopup from './DeleteShiftConfirmationPopup'
import ViewIcon from '@/icons/ViewIcon'
import ViewEditShift from './ViewEditShift'
const ViewShifts = () => {
    const { width } = useWidth()
    const { permissions, checkPermission } = useAuth()

    const [rows, setRows] = useState([]);
    const [department, setDepartment] = useState('')
    const [departments, setDepartments] = useState([])
    const [process, setProcess] = useState('')
    const [processes, setProcesses] = useState([])
    const [addEmployeePopupOpen, setAddEmployeePopupOpen] = useState(false)

    const showAllShifts = async () => {
      try{
        console.log('process', process)
        const shifts = await getShiftsService(process)
        setRows(shifts)
      } catch(error){
        console.error(error)
        toast.error('Failed to fetch shifts')
      }
    }

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'name', headerName: 'Shift Name', width: 150 },
      { field: 'start', headerName: 'Start Time', width: 150 },
      { field: 'end', headerName: 'End Time', width: 250},
      { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => {
        const [viewEditShiftPopupOpen, setViewEditShiftPopupOpen] = useState(false)
        const handleViewEditShiftPopup = () => {
          setViewEditShiftPopupOpen((prev)=>!prev)
        }
        const handleViewEditShiftEvent = () => {
          setViewEditShiftPopupOpen(false)
          showAllShifts()
        }

        const [deleteShiftPopupOpen, setDeleteShiftPopupOpen] = useState(false)
        const handleDeleteShiftPopup = () => {
          setDeleteShiftPopupOpen((prev)=>!prev)
        }
        const handleDeleteShiftEvent = () => {
          setDeleteShiftPopupOpen(false)
          showAllShifts()
        }

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {<ViewIcon onClick={handleViewEditShiftPopup} color={`blue-500`} />}
          {checkPermission(PERMISSIONS.DELETE_ROLE) && <DeleteIcon onClick={handleDeleteShiftPopup} />}
        </Box>
        <ViewEditShift open={viewEditShiftPopupOpen} onClose={handleViewEditShiftPopup} onSubmit={handleViewEditShiftEvent} shiftId={params?.id} />
        {/* <ViewEditEmployeeDetails open={viewEditEmployeeDetailPopupOpen} onClose={handleViewEditEmployeeDetailPopup} onSubmit={handleViewEditEmployeeDetailEvent} employeeId={params?.id}  /> */}
        <DeleteShiftConfirmationPopup open={deleteShiftPopupOpen} onClose={handleDeleteShiftPopup} onSubmit={handleDeleteShiftEvent} shiftId={params?.id} />
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

    
    

    const handleAddEmployeePopup = () => {
      setAddEmployeePopupOpen((prev)=>!prev)
    }

    const handleAddEmployeeEvent = () => {
      setAddEmployeePopupOpen(false)
      showAllShifts()
    }

    const getDepartments = async () => {
      try{
        const departments = await getAllDepartmentsService()
        setDepartments(departments)
      } catch(error){
        console.error(error)
        toast.error('Failed to fetch employees')
      }
    }
    useEffect(()=> {
      getDepartments()
    },[])

    useEffect(()=> {
      if (!departments.length) return;
      setDepartment(departments[0]?.id)
    },[departments])

    const getProcesses = async (department) => {
      try{
        const processes = await getDepartmentProcessesService(department)
        setProcesses(processes)
      } catch(error){
        console.error(error)
        toast.error('Failed to fetch employees')
      }
    }

    useEffect(()=> {
      if (!department){
        setProcesses([])
        return
      }
      getProcesses(department)
    },[department])

    useEffect(()=> {
      if (!processes.length) return;
      setProcess(processes[0]?.id)
    },[processes])

    useEffect(()=> {
      if (!process){
        setRows([])
        return
      }
      showAllShifts()
    },[process])

  return (
    <Box className="p-4">
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box gap={1} display={'flex'}>
          <FormControl fullWidth size="small">
          <InputLabel sx={{ backgroundColor: 'white' }}>Department</InputLabel>
          <Select
            value={department}
            label="Department"
            size='small'
            sx={{
              width: Math.min(width*0.25,300),
            }}
            onChange={(e)=>setDepartment(e.target.value)}
            // disabled={fields[key].disabled || !fields[key]?.options?.length}
            // fullWidth
          >
            {departments.map((option) => (
              <MenuItem key={option?.id} value={option?.id}>{option?.name}</MenuItem>
            ))}
          </Select>
          </FormControl>
          <FormControl fullWidth size="small">
          <InputLabel sx={{ backgroundColor: 'white' }}>Process</InputLabel>
          <Select
            value={process}
            size='small'
            sx={{
              width: Math.min(width*0.25,300),
            }}
            onChange={(e)=>setProcess(e.target.value)}
            disabled={!department}
            // fullWidth
          >
            {processes.map((option) => (
              <MenuItem key={option?.id} value={option?.id}>{option?.name}</MenuItem>
            ))}
          </Select>
          </FormControl>
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
        rows={rows}
        columns={columns}
        pageSizeOptions={[5,10,15]}
        disableRowSelectionOnClick
        sx={{
            fontSize: Math.max(width/100, 15)
        }}
      />
      <AddShift open={addEmployeePopupOpen} onClose={handleAddEmployeePopup} onSubmit={handleAddEmployeeEvent} />
    </Box>
  )
}

export default ViewShifts
