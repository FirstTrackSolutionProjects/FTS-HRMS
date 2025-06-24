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
    { field: 'space', headerName: '', width: 1, disableColumnMenu: true, sortable: false },
    {
      field: 'name',
      headerName: 'Salary Component',
      width: 250,
      renderCell: (params) => (
        <div style={{ fontWeight: params.row.is_basic_salary ? 'bold' : 'normal' }}>
          {params.value}
        </div>
      )
    },
    { field: 'category', headerName: 'Category', width: 200 },
    {
      field: 'calculation_type',
      headerName: 'Calculation Type',
      width: 200,
    },
    {
      field: 'percentage',
      headerName: 'Percentage',
      width: 120,
      renderCell: (params) => params.value ? `${params.value}%` : '-'
    },
    {
      field: 'cap_amount',
      headerName: 'Cap Amount',
      width: 140,
      renderCell: (params) => params.value ? `₹${params.value}` : '-'
    },
    {
      field: 'target_component_name',
      headerName: 'Target Component',
      width: 180,
    },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => params.value ? '✔️' : '❌'
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
      const componentPolicies = await getPayrollComponentPoliciesService()
      setRows(componentPolicies)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch payroll policies')
    } finally {
      setLoading(false)
    }
  }

  const handleEditPayrollPolicyPopup = () => {
    setOpenEditPayrollPolicyPopup(prev => !prev)
  }

  const handleEditPayrollDatePopup = () => {
    setOpenEditPayrollDatePopup(prev => !prev)
  }

  const handleUpdateSuccess = () => {
    handleEditPayrollPolicyPopup()
    fetchPayrollPolicies()
  }

  return (
    <Box className="flex flex-col items-center h-full">
      <Box className="flex flex-col justify-center max-w-[1250px] w-full">
        <DataGrid
          columns={allColumns}
          rows={rows}
          disableRowSelectionOnClick
          loading={loading}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} gap={1}>
          <CustomButton sx={{ marginY: 1 }} title="MANAGE DATE" onClick={handleEditPayrollDatePopup} />
          <CustomButton sx={{ marginY: 1 }} title="EDIT" onClick={handleEditPayrollPolicyPopup} />
        </Box>
      </Box>

      <EditPayrollComponents
        open={openEditPayrollPolicyPopup}
        onClose={handleEditPayrollPolicyPopup}
        payrollComponentData={rows}
        allComponents={rows}
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
