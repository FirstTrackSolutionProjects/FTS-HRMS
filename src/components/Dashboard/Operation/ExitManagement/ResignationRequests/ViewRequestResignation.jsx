import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '@/contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AddBranch from '@/components/Dashboard/Organization/ManageBranch/AddBranch'
import getAllAttendancesService from '@/services/attendanceServices/getAllAttendancesService'
import ShowRequestPopup from './ShowRequestPopup'
import CustomButton from '@/components/CustomComponents/CustomButton'
import ViewIcon from '@/icons/ViewIcon'
import getAllResignationApplicationsService from '@/services/exitServices/resignationServices/getAllResignationApplicationsService'
const ViewRequestResignation = () => {
    const { width } = useWidth()
    const { permissions } = useAuth()

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'id', headerName: 'Resignation ID', width: 150 },
      { field: 'status', headerName: 'Status', width: 150 },
      { field: 'createdAt', headerName: 'Applied At', width: 200 },
      { field: 'action', headerName: 'Action', width: 150, 
        renderCell: (params) => {
            const [showRequestPopupOpen, setShowRequestPopupOpen,] = useState(false)
            const handleShowRequestPopup = () => {
                setShowRequestPopupOpen(prev => !prev)
            }

            return (
                <>
                <Box className="flex flex-1 items-center h-full" gap={2}>
                  {<ViewIcon onClick={handleShowRequestPopup} />}
                </Box>
                <ShowRequestPopup open={showRequestPopupOpen} onClose={handleShowRequestPopup} applicationId={params?.id}  />
                </>
            )
        }
      },
    ]

    const columns = useMemo(() => {
      return allColumns.filter((col) => {
        return true;
      });
    }, [permissions]);

    
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([])
    const [branchNameSearch, setBranchNameSearch] = useState('')
    const [applyResignationPopupOpen, setApplyResignationPopupOpen] = useState(false)

    const handleApplyResignationPopup = () => {
      setApplyResignationPopupOpen((prev)=>!prev)
    }

    const handleApplyResignationEvent = () => {
      setAddBranchPopupOpen(false)
      getAllBranches()
    }

    const getAllBranches = async () => {
      const branches = await getAllResignationApplicationsService()
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

export default ViewRequestResignation
