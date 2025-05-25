import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '@/contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import getAllBranchesService from '@/services/getAllBranchesService'
import CustomButton from '@/components/CustomComponents/CustomButton'
import { useAuth } from '@/contexts/AuthContext'
import { PERMISSIONS } from '@/constants'
import EditIcon from '@/icons/EditIcon'
import UpdateBranch from '@/components/Dashboard/Organization/ManageBranch/UpdateBranch'
import AddBranch from '@/components/Dashboard/Organization/ManageBranch/AddBranch'
import getAllAttendancesService from '@/services/attendanceServices/getAllAttendancesService'
const ViewAttendances = () => {
    const { width } = useWidth()
    const { permissions } = useAuth()

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'employee_first_name', headerName: 'First Name', width: 150 },
      { field: 'employee_last_name', headerName: 'Last Name', width: 250},
      { field: 'batch_name', headerName: 'Batch Name', width: 100},
      { field: 'shift_name', headerName: 'Shift Name', width: 100},
      { field: 'process_name', headerName: 'Process Name', width: 100},
      { field: 'department_name', headerName: 'Department Name', width: 200 },
      { field: 'branch_name', headerName: 'Branch Name', width: 200 },
      { field: 'checked_in_at', headerName: 'Checked In At', width: 200 },
      { field: 'alloted_work_time', headerName: 'Alloted Work Time', width: 200 },
      { field: 'work_time', headerName: 'Actual Work Time', width: 200, 
        renderCell: (params) => {
            if (!params?.row?.checked_out){
                return "Currently Working"
            }
            return params.value
        }
       },
       { field: 'alloted_official_break_time', headerName: 'Alloted Official Break Time', width: 200 },
       { field: 'official_break_time', headerName: 'Actual Official Break Time', width:200,
        renderCell: (params) => {
            if (!params?.row?.checked_out){
                return "Currently Working"
            }
            return params.value
        }
        },
        { field: 'alloted_personal_break_time', headerName: 'Alloted Personal Break Time', width: 200 },
        { field: 'personal_break_time', headerName: 'Actual Personal Break Time', width: 200, 
            renderCell: (params) => {
                if (!params?.row?.checked_out){
                return "Currently Working"
            }
            return params.value
            }
         },
      { field: 'working_status', headerName: 'Working Status', width: 150, 
        renderCell : (params) => {
            if(params?.row?.is_working){
                return 'Working'
            } else if (params?.row?.in_break){
                return 'Break'
            } else if (params?.row?.checked_out){
                return 'Checked Out'
            }
        }
       },
       { field: 'attendance_status', headerName: 'Attendance Status', width: 150,
        renderCell : (params) => {
            const row = params?.row;
            if (row?.is_present){
                return 'Present'
            } else if (row?.is_halftime){
                return 'Half Time'
            } else if (row?.is_absent){
                return 'Absent'
            }
        }
        },
    //   { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => {
    //     const [updateBranchPopupOpen, setUpdateBranchPopupOpen] = useState(false)
    //     const handleUpdateBranchPopup = () => {
    //       setUpdateBranchPopupOpen((prev)=>!prev)
    //     }
    //     const handleUpdateBranchEvent = () => {
    //       setUpdateBranchPopupOpen(false)
    //       getAllBranches()
    //     }

    //     return (
    //     <>
    //     <Box className="flex flex-1 items-center h-full" gap={2}>
    //       {checkPermission(PERMISSIONS.UPDATE_BRANCH) && <EditIcon onClick={handleUpdateBranchPopup} />}
    //     </Box>
    //     <UpdateBranch open={updateBranchPopupOpen} onClose={handleUpdateBranchPopup} onSubmit={handleUpdateBranchEvent} branchId={params?.id} branchData={params?.row}  />
    //     </>
    //   )}
    //   }
    ]

    const columns = useMemo(() => {
      return allColumns.filter((col) => {
        if (col.field === "action" && !checkPermission("")) return false;
        return true;
      });
    }, [permissions]);

    
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([])
    const [branchNameSearch, setBranchNameSearch] = useState('')
    const [addBranchPopupOpen, setAddBranchPopupOpen] = useState(false)

    const handleAddBranchPopup = () => {
      setAddBranchPopupOpen((prev)=>!prev)
    }

    const handleAddBranchEvent = () => {
      setAddBranchPopupOpen(false)
      getAllBranches()
    }

    const getAllBranches = async () => {
      const branches = await getAllAttendancesService()
      setRows(branches)
    }
    useEffect(()=> {
      getAllBranches()
    },[])

    useEffect(()=>{
      setBranchNameSearch('')
      setFilteredRows(rows)
    },[rows])

    useEffect(()=>{
      setFilteredRows(rows.filter(row => row.name.toLowerCase().includes(branchNameSearch.toLowerCase())))
    },[branchNameSearch])
  return (
    <Box className="p-4">
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box>
          <TextField
            size='small'
            placeholder="Search By Branch Name"
            value={branchNameSearch}
            onChange={(e)=>setBranchNameSearch(e.target.value)}
            sx={{
              width: Math.min(width*0.55,400)
            }}
          />
        </Box>
        {/* <Box sx={{
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
            onClick={handleAddBranchPopup}
          />
        </Box> */}
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
      <AddBranch open={addBranchPopupOpen} onClose={handleAddBranchPopup} onSubmit={handleAddBranchEvent} />
    </Box>
  )
}

export default ViewAttendances
