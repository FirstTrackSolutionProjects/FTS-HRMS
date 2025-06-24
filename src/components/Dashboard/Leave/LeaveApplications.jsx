import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '@/contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { PERMISSIONS } from '@/constants'
import getLeavePoliciesService from '@/services/leaveServices/leavePolicyServices/getLeavePoliciesService'
import AddLeavePolicy from '@/components/Dashboard/Organization/LeavePolicy/AddLeavePolicy'
import ToggleLeavePolicyConfirmationPopup from '@/components/Dashboard/Organization/LeavePolicy/ToggleLeavePolicyConfirmationPopup'
import ViewIcon from '@/icons/ViewIcon'
import ViewEditLeavePolicy from '@/components/Dashboard/Organization/LeavePolicy/ViewEditLeavePolicy'
import DisableIcon from '@/icons/DisableIcon'
import { Tooltip } from 'react-tooltip'
import EnableIcon from '@/icons/EnableIcon'
import CustomButton from '@/components/CustomComponents/CustomButton'
import getMyLeaveApplicationsService from '@/services/leaveServices/leaveApplicationServices/getMyLeaveApplicationsService'
import CancelLeaveConfirmationPopup from './CancelLeavePopup'
import ViewLeaveApplication from './ViewLeaveApplication'
const LeaveApplications = () => {
    const { width } = useWidth()
    const { permissions, checkPermission } = useAuth()
    const [rows, setRows] = useState([]);
    const [addLeavePolicyPopupOpen, setAddLeavePolicyPopupOpen] = useState(false)

    const showAllLeavePolicies = async () => {
      try{
        const leavePolicies = await getMyLeaveApplicationsService()
        setRows(leavePolicies)
      } catch(error){
        console.error(error)
        toast.error('Failed to fetch leave policies')
      }
    }

    useEffect(()=>{
        showAllLeavePolicies()
    },[])

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'leave_policy_name', headerName: 'Leave Name', width: 200 },
      { field: 'leave_days', headerName: 'Leave Duration', width: 150 },
      { field: 'status', headerName: 'Status', width: 150 },
      { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => {
        const [viewEditLeavePolicyPopupOpen, setViewEditLeavePolicyPopupOpen] = useState(false)
        const handleViewEditLeavePolicyPopup = () => {
          setViewEditLeavePolicyPopupOpen((prev)=>!prev)
        }
        const handleViewEditLeavePolicyEvent = () => {
          setViewEditLeavePolicyPopupOpen(false)
          showAllLeavePolicies()
        }

        const [toggleLeavePolicyPopupOpen, setToggleLeavePolicyPopupOpen] = useState(false)
        const handleToggleLeavePolicyPopup = () => {
          setToggleLeavePolicyPopupOpen((prev)=>!prev)
        }
        const handleToggleLeavePolicyEvent = () => {
          setToggleLeavePolicyPopupOpen(false)
          showAllLeavePolicies()
        }

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {<span data-tooltip-id='view_edit_leave_policy'> 
            <ViewIcon onClick={handleViewEditLeavePolicyPopup} color={`blue-500`} />
          </span>}
          {checkPermission(PERMISSIONS.DELETE_ROLE) && 
            <span data-tooltip-id={`toggle_leave_policy`} data-tooltip-place="bottom">
              {params?.row?.status == "PENDING" ? <DisableIcon onClick={handleToggleLeavePolicyPopup} /> : null}
            </span>
          }
        </Box>
        <ViewLeaveApplication open={viewEditLeavePolicyPopupOpen} onClose={handleViewEditLeavePolicyPopup} onSubmit={handleViewEditLeavePolicyEvent} leaveApplicationId={params?.id} />
        <CancelLeaveConfirmationPopup open={toggleLeavePolicyPopupOpen} onClose={handleToggleLeavePolicyPopup} onSubmit={handleToggleLeavePolicyEvent} leaveApplicationId={params?.id} />
        <Tooltip
          id={`view_edit_leave_policy`}
          place="bottom"
          className='z-50'
          content="View/Edit Leave Policy"
        />
        <Tooltip
          id={`toggle_leave_policy`}
          place="left"
          className='z-50'
          content={params?.row?.is_active?"Disable Leave Policy":"Enable Leave Policy"}
        />
        </>
      )
    }
      },
      { field: 'created_at', headerName: 'Created At', width: 300 }
    ]

    const columns = useMemo(() => {
      return allColumns.filter((col) => {
        if (col.field === "action" && !checkPermission(PERMISSIONS.AUDIT_JOINUS)) return false;
        return true;
      });
    }, [permissions]);
    

    const handleAddLeavePolicyPopup = () => {
      setAddLeavePolicyPopupOpen((prev)=>!prev)
    }

    const handleAddLeavePolicyEvent = () => {
      setAddLeavePolicyPopupOpen(false)
      showAllLeavePolicies()
    }

  return (
    <Box className="p-4 items-center flex flex-col">
        <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
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
            onClick={handleAddLeavePolicyPopup}
          />
        </Box> */}
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5,10,15]}
        disableRowSelectionOnClick
        sx={{
            fontSize: Math.max(width/100, 15),
            width: Math.min(1000, width)
        }}
      />
      <AddLeavePolicy open={addLeavePolicyPopupOpen} onClose={handleAddLeavePolicyPopup} onSubmit={handleAddLeavePolicyEvent} />
    </Box>
  )
}

export default LeaveApplications
