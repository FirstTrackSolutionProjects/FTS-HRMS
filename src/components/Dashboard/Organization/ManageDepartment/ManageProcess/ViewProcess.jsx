import Popup from '@/components/CustomComponents/Popup'
import { PERMISSIONS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useWidth } from '@/contexts/WidthContext';
import EditIcon from '@/icons/EditIcon';
import getDepartmentProcessesService from '@/services/getDepartmentProcessesService';
import { Box, TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import AddProcess from './AddProcess';
import UpdateProcess from './UpdateProcess';
import CustomButton from '@/components/CustomComponents/CustomButton';
import { DataGrid } from '@mui/x-data-grid';

const ViewProcess = ({open, onClose, departmentId}) => {
    if (!open) return;
    const { width } = useWidth()
    const { permissions, checkPermission } = useAuth()

    const allColumns = [
      { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
      { field: 'id', headerName: 'Designation ID', width: 100},
      { field: 'name', headerName: 'Designation Name', width: 150 },
      { field: 'description', headerName: 'Designation Description', width:200},
      { field: 'createdAt', headerName: 'Created At', width: 200 },
      { field: 'updatedAt', headerName: 'Updated At', width: 200 },
      { field: 'action', headerName: 'Action', width: 100,renderCell: (params) => {
        const [updateProcessPopupOpen, setUpdateProcessPopupOpen] = useState(false)
        const handleUpdateProcessPopup = () => {
          setUpdateProcessPopupOpen((prev)=>!prev)
        }
        const handleUpdateProcessEvent = () => {
          setUpdateProcessPopupOpen(false)
          getDepartmentProcesses()
        }

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {checkPermission(PERMISSIONS.UPDATE_PROCESS) && <EditIcon onClick={handleUpdateProcessPopup} />}
        </Box>
        <UpdateProcess open={updateProcessPopupOpen} onClose={handleUpdateProcessPopup} onSubmit={handleUpdateProcessEvent} processId={params?.id} processData={params?.row}  />
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
    const [processNameSearch, setProcessNameSearch] = useState('')
    const [addProcessPopupOpen, setAddProcessPopupOpen] = useState(false)

    const handleAddProcessPopup = () => {
      setAddProcessPopupOpen((prev)=>!prev)
    }

    const handleAddProcessEvent = () => {
      setAddProcessPopupOpen(false)
      getDepartmentProcesses()
    }

    const getDepartmentProcesses = async () => {
      const processes = await getDepartmentProcessesService(departmentId)
      setRows(processes)
    }
    useEffect(()=> {
      getDepartmentProcesses()
    },[])

    useEffect(()=>{
      setProcessNameSearch('')
      setFilteredRows(rows)
    },[rows])

    useEffect(()=>{
      setFilteredRows(rows.filter(row => row.name.toLowerCase().includes(processNameSearch.toLowerCase())))
    },[processNameSearch])
    return (
    <Popup open={open} close={onClose} title={'Processes'}>
        <Box className="p-4">
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box>
          <TextField
            size='small'
            placeholder="Search By Process Name"
            value={processNameSearch}
            onChange={(e)=>setProcessNameSearch(e.target.value)}
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
            onClick={handleAddProcessPopup}
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
      <AddProcess open={addProcessPopupOpen} onClose={handleAddProcessPopup} onSubmit={handleAddProcessEvent} departmentId={departmentId} />
    </Box>
    </Popup>
  )
}

export default ViewProcess
