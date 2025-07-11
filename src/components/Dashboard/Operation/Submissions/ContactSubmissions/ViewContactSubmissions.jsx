import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '@/contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import getAllBranchesService from '@/services/getAllBranchesService'
import { useAuth } from '@/contexts/AuthContext'
import { PERMISSIONS } from '@/constants'
import getContactSubmissionsService from '@/services/submissionServices/contactSubmissionServices/getContactSubmissionsService'
import ViewIcon from '@/icons/ViewIcon'
import ViewContactSubmission from './ViewContactSubmission'
const ViewContactSubmissions = () => {
    const { width } = useWidth()
    const { permissions, checkPermission } = useAuth()

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'id', headerName: 'Submission ID', width: 100},
      { field: 'first_name', headerName: 'First Name', width: 150 },
      { field: 'last_name', headerName: 'Last Name', width: 250},
      { field: 'email', headerName: 'Email', width: 100},
      { field: 'mobile', headerName: 'Phone', width: 100},
      { field: 'createdAt', headerName: 'Received At', width: 200 },
      { field: 'action', headerName: 'Action', width: 100,
        renderCell: (params) => {
            const [viewEditEmployeeDetailPopupOpen, setViewEditEmployeeDetailPopupOpen] = useState(false)
            const handleViewEditEmployeeDetailPopup = () => {
            setViewEditEmployeeDetailPopupOpen((prev)=>!prev)
            }
            const handleViewEditEmployeeDetailEvent = () => {
            setViewEditEmployeeDetailPopupOpen(false)
            }
            return (
                <>
                    <Box className="flex flex-1 items-center h-full" gap={2}>
                      {<ViewIcon onClick={handleViewEditEmployeeDetailPopup} />}
                    </Box>
                    <ViewContactSubmission open={viewEditEmployeeDetailPopupOpen} onClose={handleViewEditEmployeeDetailPopup} onSubmit={handleViewEditEmployeeDetailEvent} submissionId={params?.id}  />
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
    const [addBranchPopupOpen, setAddBranchPopupOpen] = useState(false)

    const handleAddBranchPopup = () => {
      setAddBranchPopupOpen((prev)=>!prev)
    }

    const handleAddBranchEvent = () => {
      setAddBranchPopupOpen(false)
      getAllBranches()
    }

    const getAllBranches = async () => {
      const branches = await getContactSubmissionsService()
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
      {/* <Box sx={{
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
            onClick={handleAddBranchPopup}
          />
        </Box>
      </Box> */}
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSizeOptions={[5,10,15]}
        disableRowSelectionOnClick
        sx={{
            fontSize: Math.max(width/100, 15)
        }}
      />
      {/* <AddBranch open={addBranchPopupOpen} onClose={handleAddBranchPopup} onSubmit={handleAddBranchEvent} /> */}
    </Box>
  )
}

export default ViewContactSubmissions
