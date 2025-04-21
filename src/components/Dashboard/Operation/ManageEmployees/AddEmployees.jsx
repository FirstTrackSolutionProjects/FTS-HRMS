import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActionPopup from '@/components/CustomComponents/ActionPopup';
import CustomButton from '@/components/CustomComponents/CustomButton';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
} from "@mui/material";
import CustomForm from "@/components/CustomComponents/CustomForm";
import createEmployeeService from "@/services/createEmployeeService";
import { useApp } from "@/contexts/AppContext";

// Payroll Table Component
const PayrollTable = ({ payrollFields, payrollData, setPayrollData }) => {
  const handlePayrollChange = (e, key) => {
    const { value } = e.target;
    if (/^-?\d*$/.test(value)) {
      setPayrollData((prevData) => ({ ...prevData, [key]: value }));
    }
  };
  const totalCompensation = Object.keys(payrollData)
  .reduce((sum, key) => {
    const value = parseFloat(payrollData[key]); 
    return !isNaN(value) ? sum + value : sum;
  }, 0);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table size="small" aria-label="payroll table"> 
        <TableHead>
          <TableRow>
            <TableCell>Payroll Component</TableCell>
            <TableCell>Amount (Monthly)</TableCell>
            <TableCell>Amount (Yearly)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(payrollFields).map((key) => (
            <TableRow key={key}>
              <TableCell>{payrollFields[key].label}</TableCell>
              <TableCell>
                <TextField
                  type="text"
                  size="small"
                  name={key}
                  value={payrollData[key]}
                  onChange={(e) => handlePayrollChange(e, key)}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="text"
                  size="small"
                  name={key}
                  value={payrollData[key]*12}
                  disabled
                  fullWidth
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
              <TableCell>Total Compensation</TableCell>
              <TableCell>
                <TextField
                  type="text"
                  size="small"
                  value={totalCompensation}
                  disabled
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="text"
                  size="small"
                  value={totalCompensation*12}
                  disabled
                  fullWidth
                />
              </TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const AddEmployees = ({ open, onClose, onSubmit }) => {
  if (!open) return;
  const {
    employeeFields,
    setEmployeeFields,
    refreshFormUuid
  } = useApp() 

  useEffect(()=>{
    refreshFormUuid();
  },[])

  const employeeFormRef = useRef();

  const employeeData = employeeFormRef?.current?.formData;
  const loadingState = employeeFormRef?.current?.loadingState;
  const setLoadingState = employeeFormRef?.current?.setLoadingState;

  const payrollFields = {
    basic_salary: { label: "Basic Salary" },
    conveyance_allowance: { label: "Conveyance Allowance"},
    house_rent_allowance: { label: "House Rent Allowance" },
    mess_allowance: { label: "Mess Allowance" },
    medical_allowance: { label: "Medical Allowance" },
  }

  const [payrollData, setPayrollData] = useState(Object.fromEntries(Object.keys(payrollFields).map(key => [key, 0])));

  

  const handleSubmit = async () => {
    setLoadingState('Creating Employee...');
    try {
      console.log(employeeData)
      await createEmployeeService(employeeData, payrollData)
      toast.success("Employee added successfully");
      onSubmit()
    } catch (err) {
      console.error(err);
      toast.error("Failed to add employee");
    } finally {
      setLoadingState(null);
    }
  };

  return (
    <ActionPopup open={open} onClose={onClose} title="Add Employee" actions={[
      <CustomButton
          title={loadingState || 'Submit'}
          variant="contained"
          color="primary"
          size="small"
          disabled={loadingState?true:false}
          onClick={employeeFormRef?.current?.submitForm}
          sx={{ marginTop: 2, width: '100%' }}
        />
    ]}>
      <CustomForm 
        ref={employeeFormRef} 
        fields={employeeFields} 
        setFields={setEmployeeFields} 
        handleSubmit={handleSubmit}
      />
      <PayrollTable payrollFields={payrollFields} payrollData={payrollData} setPayrollData={setPayrollData} />
    </ActionPopup>
  );
};

export default AddEmployees;