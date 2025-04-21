import { Box, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useWidth } from '@/contexts/WidthContext'
import { useEffect, useMemo, useState } from 'react'
import getAllDepartmentsService from '@/services/getAllDepartmentsService'
import CustomButton from '@/components/CustomComponents/CustomButton'
import { useAuth } from '@/contexts/AuthContext'
import { headerNavItems, PERMISSIONS } from '@/constants'
import EditIcon from '@/icons/EditIcon'
import UpdateDepartment from '@/components/Dashboard/Organization/ManageDepartment/UpdateDepartment'
import AddDepartment from '@/components/Dashboard/Organization/ManageDepartment/AddDepartment'
import ViewDesignation from './ManageDesignation/ViewDesignation'
import ViewProcess from './ManageProcess/ViewProcess'
const ViewDepartment = () => {
    const { width } = useWidth()
    const { permissions, checkPermission } = useAuth()

    const [selectedRowId, setSelectedRowId] = useState(null);

    const [openDesignationPopup, setOpenDesignationPopup] = useState(false);

    const handleDesignationPopup = () => {
        setOpenDesignationPopup((prev) => !prev);
    }

    const [openProcessPopup, setOpenProcessPopup] = useState(false);

    const handleProcessPopup = () => {
        setOpenProcessPopup((prev) => !prev);
    }

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'id', headerName: 'Department ID', width: 100},
      { field: 'name', headerName: 'Department Name', width: 150 },
      { field: 'description', headerName: 'Department Description', width:200},
      { field: 'createdAt', headerName: 'Created At', width: 200 },
      { field: 'updatedAt', headerName: 'Updated At', width: 200 },
      { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => {
        const [updateDepartmentPopupOpen, setUpdateDepartmentPopupOpen] = useState(false)
        const handleUpdateDepartmentPopup = () => {
          setUpdateDepartmentPopupOpen((prev)=>!prev)
        }
        const handleUpdateDepartmentEvent = () => {
          setUpdateDepartmentPopupOpen(false)
          getAllDepartments()
        }

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {checkPermission(PERMISSIONS.UPDATE_DEPARTMENT) && <EditIcon onClick={handleUpdateDepartmentPopup} />}
        </Box>
        <UpdateDepartment open={updateDepartmentPopupOpen} onClose={handleUpdateDepartmentPopup} onSubmit={handleUpdateDepartmentEvent} departmentId={params?.id} departmentData={params?.row}  />
        </>
      )}
      }
    ]

    const columns = useMemo(() => {
      return allColumns.filter((col) => {
        if (col.field === "action" && !checkPermission("")) return false;
        return true;
      });
    }, [permissions]);

    
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([])
    const [departmentNameSearch, setDepartmentNameSearch] = useState('')
    const [addDepartmentPopupOpen, setAddDepartmentPopupOpen] = useState(false)

    const handleAddDepartmentPopup = () => {
      setAddDepartmentPopupOpen((prev)=>!prev)
    }

    const handleAddDepartmentEvent = () => {
      setAddDepartmentPopupOpen(false)
      getAllDepartments()
    }

    const getAllDepartments = async () => {
      const departments = await getAllDepartmentsService()
      setRows(departments)
    }
    useEffect(()=> {
      getAllDepartments()
    },[])

    useEffect(()=>{
      setDepartmentNameSearch('')
      setFilteredRows(rows)
    },[rows])

    useEffect(()=>{
      setFilteredRows(rows.filter(row => row.name.toLowerCase().includes(departmentNameSearch.toLowerCase())))
    },[departmentNameSearch])

  const handleRowSelection = (ids) => {
    const selectedId = ids[0]; // only first selected row (if single selection)
    setSelectedRowId(selectedId);
    console.log('Selected row ID:', selectedId);
  };
  return (
    <Box className="p-4">
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box>
          <TextField
            size='small'
            placeholder="Search By Department Name"
            value={departmentNameSearch}
            onChange={(e)=>setDepartmentNameSearch(e.target.value)}
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
            onClick={handleAddDepartmentPopup}
          />
        </Box>
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSizeOptions={[5,10,15]}
        onRowSelectionModelChange={handleRowSelection}
        sx={{
            fontSize: Math.max(width/100, 15)
        }}
      />
      <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
          alignItems: 'center',
          flex: 1
        }}
        gap={1}
        >
      <CustomButton 
            sx={{
              marginY: 1
            }}
            title="PROCESS"
            disabled={!selectedRowId}
            onClick={handleProcessPopup}
          />
            <CustomButton 
            sx={{
              marginY: 1
            }}
            title="DESIGNATION"
            disabled={!selectedRowId}
            onClick={handleDesignationPopup}
          />
          </Box>
      <AddDepartment open={addDepartmentPopupOpen} onClose={handleAddDepartmentPopup} onSubmit={handleAddDepartmentEvent} />
      <ViewDesignation open={openDesignationPopup} onClose={handleDesignationPopup} departmentId={selectedRowId} />
      <ViewProcess open={openProcessPopup} onClose={handleProcessPopup} departmentId={selectedRowId} />
    </Box>
  )
}

export default ViewDepartment
