import Popup from '@/components/CustomComponents/Popup'
import { PERMISSIONS } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useWidth } from '@/contexts/WidthContext';
import EditIcon from '@/icons/EditIcon';
import getDepartmentDesignationsService from '@/services/getDepartmentDesignationsService';
import { Box, TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import AddDesignation from './AddDesignation';
import UpdateDesignation from './UpdateDesignation';
import CustomButton from '@/components/CustomComponents/CustomButton';
import { DataGrid } from '@mui/x-data-grid';

const ViewDesignation = ({open, onClose, departmentId}) => {
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
        const [updateDesignationPopupOpen, setUpdateDesignationPopupOpen] = useState(false)
        const handleUpdateDesignationPopup = () => {
          setUpdateDesignationPopupOpen((prev)=>!prev)
        }
        const handleUpdateDesignationEvent = () => {
          setUpdateDesignationPopupOpen(false)
          getDepartmentDesignations()
        }

        return (
        <>
        <Box className="flex flex-1 items-center h-full" gap={2}>
          {checkPermission(PERMISSIONS.UPDATE_DESIGNATION) && <EditIcon onClick={handleUpdateDesignationPopup} />}
        </Box>
        <UpdateDesignation open={updateDesignationPopupOpen} onClose={handleUpdateDesignationPopup} onSubmit={handleUpdateDesignationEvent} designationId={params?.id} designationData={params?.row}  />
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
    const [designationNameSearch, setDesignationNameSearch] = useState('')
    const [addDesignationPopupOpen, setAddDesignationPopupOpen] = useState(false)

    const handleAddDesignationPopup = () => {
      setAddDesignationPopupOpen((prev)=>!prev)
    }

    const handleAddDesignationEvent = () => {
      setAddDesignationPopupOpen(false)
      getDepartmentDesignations()
    }

    const getDepartmentDesignations = async () => {
      const designations = await getDepartmentDesignationsService(departmentId)
      setRows(designations)
    }
    useEffect(()=> {
      getDepartmentDesignations()
    },[])

    useEffect(()=>{
      setDesignationNameSearch('')
      setFilteredRows(rows)
    },[rows])

    useEffect(()=>{
      setFilteredRows(rows.filter(row => row.name.toLowerCase().includes(designationNameSearch.toLowerCase())))
    },[designationNameSearch])
    return (
    <Popup open={open} close={onClose} title={'Designations'}>
        <Box className="p-4">
      <Box sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <Box>
          <TextField
            size='small'
            placeholder="Search By Designation Name"
            value={designationNameSearch}
            onChange={(e)=>setDesignationNameSearch(e.target.value)}
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
            onClick={handleAddDesignationPopup}
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
      <AddDesignation open={addDesignationPopupOpen} onClose={handleAddDesignationPopup} onSubmit={handleAddDesignationEvent} departmentId={departmentId} />
    </Box>
    </Popup>
  )
}

export default ViewDesignation
