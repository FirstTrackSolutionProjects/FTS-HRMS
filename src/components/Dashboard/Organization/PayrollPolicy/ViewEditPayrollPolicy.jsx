import CustomButton from '@/components/CustomComponents/CustomButton'
import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useState, useEffect } from 'react'
import EditPayrollComponents from './EditPayrollComponents'
import EditPayrollDate from './EditPayrollDate'
import { toast } from 'react-toastify'
import getPayrollComponentPoliciesService from '@/services/getPayrollComponentPoliciesService'

const ViewEditPayrollPolicy = () => {
    const allColumns = [
        { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false},
        { 
            field: 'name', 
            headerName: 'Salary Component', 
            width: 300,
            renderCell: (params) => (
                <div style={{ 
                    fontWeight: params.row.is_basic_salary ? 'bold' : 'normal',
                }}>
                    {params.value}
                </div>
            )
        },
        { 
            field: 'type', 
            headerName: 'Type', 
            width: 150,
            renderCell: (params) => (
                <div style={{ 
                    fontWeight: params.row.is_basic_salary ? 'bold' : 'normal',
                }}>
                    {params.value}
                </div>
            )
        }
    ]

    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [openEditPayrollPolicyPopup, setOpenEditPayrollPolicyPopup] = useState(false)
    const [openEditPayrollDatePopup, setOpenEditPayrollDatePopup] = useState(false)

    useEffect(() => {
        fetchPayrollPolicies()
    }, [])

    const fetchPayrollPolicies = async () => {
        try {
            setLoading(true)
            const response = await getPayrollComponentPoliciesService()
            if (response.success) {
                setRows(response.data.map(policy => ({
                    id: policy.id,
                    name: policy.name,
                    type: policy.type,
                    is_basic_salary: policy.is_basic_salary
                })))
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch payroll policies')
        } finally {
            setLoading(false)
        }
    }

    const handleEditPayrollPolicyPopup = () => {
        setOpenEditPayrollPolicyPopup((prev) => !prev)
    }

    const handleEditPayrollDatePopup = () => {
        setOpenEditPayrollDatePopup((prev) => !prev)
    }

    const handleUpdateSuccess = () => {
        handleEditPayrollPolicyPopup()
        fetchPayrollPolicies()
    }
  
    return (
        <Box className="flex flex-col items-center h-full">
            <Box className="flex flex-col justify-center max-w-[550px] w-full">
                <DataGrid
                    columns={allColumns}
                    rows={rows}
                    disableRowSelectionOnClick
                    loading={loading}
                    autoHeight
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
                        title="MANAGE DATE"
                        onClick={handleEditPayrollDatePopup}
                    />
                    <CustomButton
                        sx={{
                            marginY: 1
                        }}
                        title="EDIT"
                        onClick={handleEditPayrollPolicyPopup}
                    />
                </Box>
            </Box>
            <EditPayrollComponents 
                open={openEditPayrollPolicyPopup} 
                onClose={handleEditPayrollPolicyPopup} 
                payrollComponentData={rows} 
                onSubmit={handleUpdateSuccess} 
            />
            <EditPayrollDate
                open={openEditPayrollDatePopup}
                onClose={handleEditPayrollDatePopup}
                onSubmit={handleEditPayrollDatePopup}
            />
        </Box>
    )
}

export default ViewEditPayrollPolicy
