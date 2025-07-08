import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CustomPagination from '@/components/CustomComponents/CustomPagination'
import { useWidth } from '@/contexts/WidthContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import CustomButton from '@/components/CustomComponents/CustomButton'
import { useAuth } from '@/contexts/AuthContext'
import { PERMISSIONS } from '@/constants'
import AddShift from '@/components/Dashboard/Organization/ManageShifts/AddShift'
import ToggleShiftConfirmationPopup from '@/components/Dashboard/Organization/ManageShifts/ToggleShiftConfirmationPopup'
import ViewIcon from '@/icons/ViewIcon'
import ViewEditShift from '@/components/Dashboard/Organization/ManageShifts/ViewEditShift'
import DisableIcon from '@/icons/DisableIcon'
import { Tooltip } from 'react-tooltip'
import EnableIcon from '@/icons/EnableIcon'
import getJoinUsRequestsService from '@/services/joinUsRequestServices/getJoinUsRequestsService'
import FilterComponent from '@/components/CustomComponents/FilterComponent'
import { toast } from 'react-toastify'
import { useApp } from '@/contexts/AppContext'
import CreateJoinUsRequest from './CreateJoinUsRequest'
import ViewJoinUsRequestSubmission from './ViewJoinUsRequestSubmission'
import RefreshIcon from '@/icons/RefreshIcon'
import CancelJoinUsRequestPopup from './CancelJoinUsRequestPopup'
import RevokeJoinUsRequestPopup from './RevokeJoinUsRequestPopup'
import ReattemptJoinUsRequestPopup from './ReattemptJoinUsRequestPopup'
import EmployeeOnboardingPopup from './EmployeeOnboardingPopup'
import GeneratePayrollPopup from './GeneratePayrollPopup'
import ReviseJoinUsPayrollPopup from './ReviseJoinUsPayrollPopup'
import AssignTrainingJoinUsRequestPopup from './AssignTrainingJoinUsRequestPopup'
import ReviseTrainingJoinUsRequestPopup from './ReviseTrainingJoinUsRequestPopup'
import ReviseEmployeeOnboardingPopup from './ReviseEmployeeOnboardingPopup'
import EmployeeJoiningPopup from './EmployeeJoiningPopup'
const ViewJoinUsRequests = () => {
    const { width } = useWidth()
    const { permissions, checkPermission } = useAuth();
    const { joinUsRequestFilter } = useApp()    
    const [rows, setRows] = useState([]);
    const [createJoinUsRequestPopupOpen, setCreateJoinUsRequestPopupOpen] = useState(false);
    const filterRef = useRef()
    const paginationRef = useRef()
    const [loading, setLoading] = useState(false);
    

    const showAllJoinUsRequests = async () => {
      try {
        setLoading(true);
        const response = await getJoinUsRequestsService(filterRef?.current?.getQueryParams(), paginationRef?.current?.config?.page);
        setRows(response.data);
        console.log(response.pagination)
        paginationRef?.current?.setConfig(response.pagination);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch Join Us Requests');
      } finally {
        setLoading(false);
      }
    };    
    useEffect(() => {
      showAllJoinUsRequests();
    }, []);

    const handleFilterChange = () => {
      paginationRef?.current?.setConfig((prev)=>({
        ...prev,
        page: 0
      }));
      showAllJoinUsRequests();
    };

    const handlePageChange = () => {
      showAllJoinUsRequests();
    }

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'first_name', headerName: 'First Name', width: 150 },
      { field: 'last_name', headerName: 'Last Name', width: 150 },
      { field: 'email', headerName: 'Email', width: 150},
      { field: 'mobile', headerName: 'Mobile', width: 150 },
      { field: 'status', headerName: 'Status', width: 150 },
      { field: 'action', headerName: 'Action', width: 150,renderCell: (params) => {
        const [viewJoinUsRequestSubmissionPopupOpen, setViewJoinUsRequestSubmissionPopupOpen] = useState(false)
        const handleViewJoinUsRequestSubmissionPopup = () => {
          setViewJoinUsRequestSubmissionPopupOpen((prev)=>!prev)
        }
        const handleViewJoinUsRequestSubmissionEvent = () => {
          setViewJoinUsRequestSubmissionPopupOpen(false)
          showAllJoinUsRequests()
        }

        const [cancelJoinUsRequestPopup, setCancelJoinUsRequestPopup] = useState(false)
        const handleCancelJoinUsRequestPopup = () => {
          setCancelJoinUsRequestPopup((prev)=> !prev);
        }
        const handleCancelJoinUsRequestEvent = () => {
          setCancelJoinUsRequestPopup(false)
          showAllJoinUsRequests()
        }

        const [revokeJoinUsRequestPopup, setRevokeJoinUsRequestPopup] = useState(false)
        const handleRevokeJoinUsRequestPopup = () => {
          setRevokeJoinUsRequestPopup((prev)=> !prev);
        }
        const handleRevokeJoinUsRequestEvent = () => {
          setRevokeJoinUsRequestPopup(false)
          showAllJoinUsRequests()
        }

        const [reattemptJoinUsRequestPopup, setReattemptJoinUsRequestPopup] = useState(false)
        const handleReattemptJoinUsRequestPopup = () => {
          setReattemptJoinUsRequestPopup((prev)=> !prev);
        }
        const handleReattemptJoinUsRequestEvent = () => {
          setReattemptJoinUsRequestPopup(false)
          showAllJoinUsRequests()
        }
        
        const [onboardJoinUsRequestPopup, setOnboardJoinUsRequestPopup] = useState(false)
        const handleOnboardJoinUsRequestPopup = () => {
          setOnboardJoinUsRequestPopup((prev)=> !prev);
        }
        const handleOnboardJoinUsRequestEvent = () => {
          setOnboardJoinUsRequestPopup(false)
          showAllJoinUsRequests()
        }

        const [reviseOnboardJoinUsRequestPopup, setReviseOnboardJoinUsRequestPopup] = useState(false)
        const handleReviseOnboardJoinUsRequestPopup = () => {
          setReviseOnboardJoinUsRequestPopup((prev)=> !prev);
        }
        const handleReviseOnboardJoinUsRequestEvent = () => {
          setReviseOnboardJoinUsRequestPopup(false)
          showAllJoinUsRequests()
        }

        const [generatePayrollPopup, setGeneratePayrollPopup] = useState(false)
        const handleGeneratePayrollPopup = () => {
          setGeneratePayrollPopup((prev)=> !prev);
        }
        const handleGeneratePayrollEvent = () => {
          setGeneratePayrollPopup(false)
          showAllJoinUsRequests()
        }

        const [revisePayrollPopup, setRevisePayrollPopup] = useState(false)
        const handleRevisePayrollPopup = () => {
          setRevisePayrollPopup((prev)=> !prev);
        }
        const handleRevisePayrollEvent = () => {
          setRevisePayrollPopup(false)
          showAllJoinUsRequests()
        }

        const [startTrainingPopup, setStartTrainingPopup] = useState(false)
        const handleStartTrainingPopup = () => {
          setStartTrainingPopup((prev)=> !prev);
        }
        const handleStartTrainingEvent = () => {
          setStartTrainingPopup(false)
          showAllJoinUsRequests()
        }

        const [reviseTrainingPopup, setReviseTrainingPopup] = useState(false)
        const handleReviseTrainingPopup = () => {
          setReviseTrainingPopup((prev)=> !prev);
        }
        const handleReviseTrainingEvent = () => {
          setReviseTrainingPopup(false)
          showAllJoinUsRequests()
        }

        const [employeeJoiningPopup, setEmployeeJoiningPopup] = useState(false)
        const handleEmployeeJoiningPopup = () => {
          setEmployeeJoiningPopup((prev)=> !prev);
        }
        const handleEmployeeJoiningEvent = () => {
          setEmployeeJoiningPopup(false)
          showAllJoinUsRequests()
        }
        

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {params?.row?.status !== "PENDING" && <span data-tooltip-id='view_submission'> 
            <ViewIcon onClick={handleViewJoinUsRequestSubmissionPopup} color={`blue-500`} />
          </span>}
          {(params?.row?.status == "PENDING" && checkPermission(PERMISSIONS.DELETE_ROLE)) && 
            <span data-tooltip-id={`cancel_request`} data-tooltip-place="bottom">
              <DisableIcon onClick={handleCancelJoinUsRequestPopup} />
            </span>
          }
          {(params?.row?.status === "RECEIVED" && checkPermission(PERMISSIONS.DELETE_ROLE)) && 
            <span data-tooltip-id={`reattempt_request`} data-tooltip-place="bottom">
              {<RefreshIcon onClick={handleReattemptJoinUsRequestPopup} />}
            </span>
          }
          {(["RECEIVED", "PAYROLL GENERATED", "PAYROLL REVISED", "TRAINING STARTED", "ONBOARDED"].includes(params?.row?.status) && !params?.row?.onboarded_at && checkPermission(PERMISSIONS.DELETE_ROLE)) && 
            <span data-tooltip-id={`revoke_request`} data-tooltip-place="bottom">
              {<DisableIcon onClick={handleRevokeJoinUsRequestPopup} />}
            </span>
          }
          {(params?.row?.status === "RECEIVED") &&
            <span data-tooltip-id={`generate_payroll`} data-tooltip-place="bottom">
              {<DisableIcon onClick={handleGeneratePayrollPopup} />}
            </span>
          }
          {(["PAYROLL GENERATED", "PAYROLL REVISED", "TRAINING STARTED", "ONBOARDED", "JOINED"].includes(params?.row?.status)) && 
            <span data-tooltip-id={`view_edit_payroll`} data-tooltip-place="bottom">
              {<DisableIcon onClick={handleRevisePayrollPopup} />}
            </span>
          }
          {(["PAYROLL GENERATED"].includes(params?.row?.status)) && 
            <span data-tooltip-id={`assign_training`} data-tooltip-place="bottom">
              {<DisableIcon onClick={handleStartTrainingPopup} />}
            </span>
          }
          {(["TRAINING STARTED", "ONBOARDED", "JOINED"].includes(params?.row?.status)) && 
            <span data-tooltip-id={`view_edit_training`} data-tooltip-place="bottom">
              {<DisableIcon onClick={handleReviseTrainingPopup} />}
            </span>
          }
          {(params?.row?.status === "TRAINING STARTED" && !params?.row?.onboarded_at && checkPermission(PERMISSIONS.DELETE_ROLE)) && 
            <span data-tooltip-id={`onboard`} data-tooltip-place="bottom">
              {<EnableIcon onClick={handleOnboardJoinUsRequestPopup} />}
            </span>
          }
          {(["ONBOARDED", "JOINED"].includes(params?.row?.status) && checkPermission(PERMISSIONS.DELETE_ROLE)) && 
            <span data-tooltip-id={`view_edit_onboard`} data-tooltip-place="bottom">
              {<EnableIcon onClick={handleReviseOnboardJoinUsRequestPopup} />}
            </span>
          }
          {
            (params?.row?.status === "ONBOARDED") &&
            <span data-tooltip-id={`employee_joining`} data-tooltip-place="bottom">
              {<EnableIcon onClick={handleEmployeeJoiningPopup} />}
            </span>
          }
        </Box>
        <CancelJoinUsRequestPopup open={cancelJoinUsRequestPopup} onClose={handleCancelJoinUsRequestPopup} onSubmit={handleCancelJoinUsRequestEvent} requestId={params?.id} />
        <RevokeJoinUsRequestPopup open={revokeJoinUsRequestPopup} onClose={handleRevokeJoinUsRequestPopup} onSubmit={handleRevokeJoinUsRequestEvent} requestId={params?.id} />
        <ReattemptJoinUsRequestPopup open={reattemptJoinUsRequestPopup} onClose={handleReattemptJoinUsRequestPopup} onSubmit={handleReattemptJoinUsRequestEvent} requestId={params?.id} />
        <GeneratePayrollPopup open={generatePayrollPopup} onClose={handleGeneratePayrollPopup} onSubmit={handleGeneratePayrollEvent} requestId={params?.id} />
        <ReviseJoinUsPayrollPopup open={revisePayrollPopup} onClose={handleRevisePayrollPopup} onSubmit={handleRevisePayrollEvent} requestId={params?.id} />
        <AssignTrainingJoinUsRequestPopup open={startTrainingPopup} onClose={handleStartTrainingPopup} onSubmit={handleStartTrainingEvent} requestId={params?.id} />
        <ReviseTrainingJoinUsRequestPopup open={reviseTrainingPopup} onClose={handleReviseTrainingPopup} onSubmit={handleReviseTrainingEvent} requestId={params?.id} />
        <EmployeeOnboardingPopup open={onboardJoinUsRequestPopup} onClose={handleOnboardJoinUsRequestPopup} onSubmit={handleOnboardJoinUsRequestEvent} requestId={params?.id} />
        <ReviseEmployeeOnboardingPopup open={reviseOnboardJoinUsRequestPopup} onClose={handleReviseOnboardJoinUsRequestPopup} onSubmit={handleReviseOnboardJoinUsRequestEvent} requestId={params?.id} />
        <EmployeeJoiningPopup open={employeeJoiningPopup} onClose={handleEmployeeJoiningPopup} onSubmit={handleEmployeeJoiningEvent} requestId={params?.id} />
        <ViewJoinUsRequestSubmission open={viewJoinUsRequestSubmissionPopupOpen} onClose={handleViewJoinUsRequestSubmissionPopup} onSubmit={handleViewJoinUsRequestSubmissionEvent} requestId={params?.id} />
        <Tooltip
          id={`view_submission`}
          place="bottom"
          className='z-50'
          content="View Submission"
        />
        <Tooltip
          id={`reattempt_request`}
          place="bottom"
          className='z-50'
          content="Reattempt Request"
        />
        <Tooltip
          id={`cancel_request`}
          place="bottom"
          className='z-50'
          content="Cancel Request"
        />
        <Tooltip
          id={`revoke_request`}
          place="left"
          className='z-50'
          content={"Revoke Request"}
        />
        <Tooltip
          id={`generate_payroll`}
          place="left"
          className='z-50'
          content={"Generate Payroll"}
        />
        <Tooltip
          id={`view_edit_payroll`}
          place="left"
          className='z-50'
          content={"View/Edit Payroll"}
        />
        <Tooltip
          id={`assign_training`}
          place="left"
          className='z-50'
          content={"Assign Training"}
        />

        <Tooltip
          id={`view_edit_training`}
          place="left"
          className='z-50'
          content={"Revise Training"}
        />
        <Tooltip
          id={`onboard`}
          place="left"
          className='z-50'
          content={"Onboard Employee"}
        />
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

    
    

    const handleCreateJoinUsRequestPopup = () => {
      setCreateJoinUsRequestPopupOpen((prev)=>!prev)
    }

    const handleCreateJoinUsRequestEvent = () => {
      setCreateJoinUsRequestPopupOpen(false)
      showAllJoinUsRequests()
    }
 
  return (
    <Box className="p-4">      
    <Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <CustomButton 
              title="ADD"
              onClick={handleCreateJoinUsRequestPopup}
            />
          </Box>
        </Box>
      </Box>      
      <FilterComponent
            filterConfig={joinUsRequestFilter}
            onFilterChange={handleFilterChange}
            ref={filterRef}
          />
      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter={true}
          disableRowSelectionOnClick
          loading={loading}
          sx={{
            fontSize: Math.max(width/100, 15)
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CustomPagination
            ref={paginationRef}
            onChange={handlePageChange}
          />
        </Box>
      </Box>
      <CreateJoinUsRequest open={createJoinUsRequestPopupOpen} onClose={handleCreateJoinUsRequestPopup} onSubmit={handleCreateJoinUsRequestEvent} />
    </Box>
  )
}

export default ViewJoinUsRequests
