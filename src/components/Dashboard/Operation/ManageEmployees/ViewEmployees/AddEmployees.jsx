import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  LinearProgress
} from "@mui/material";
import CustomForm from "@/components/CustomComponents/CustomForm";
import createEmployeeService from "@/services/employeeServices/createEmployeeService";
import getPayrollComponentPoliciesService from "@/services/getPayrollComponentPoliciesService";
import { useApp } from "@/contexts/AppContext";

// Payroll Table Component
const PayrollTable = forwardRef(({ payrollFields, payrollData, setPayrollData }, ref) => {
  const [ctc, setCTC] = useState(0);
  const [allocationMode, setAllocationMode] = useState(() => 
    Object.keys(payrollFields).reduce((acc, key) => {
      acc[key] = 'direct';
      return acc;
    }, {})
  );
  const [remainingAllocation, setRemainingAllocation] = useState({ percentage: 100, amount: 0 });

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (ctc <= 0) {
        toast.error("Please enter a valid CTC amount");
        return false;
      }

      const totalPercentage = Object.keys(payrollData).reduce((sum, key) => {
        if (allocationMode[key] === 'percentage') {
          return sum + (parseFloat(payrollData[key]) || 0);
        }
        return sum + (parseFloat((payrollData[key]/ctc)*100) || 0);
      }, 0);

      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast.error("Please allocate exactly 100% of CTC");
        return false;
      }

      return true;
    },
    getCTC: () => ctc,
    getAllocationMode: () => allocationMode
  }));

  // Initialize allocationMode when payrollFields changes
  useEffect(() => {
    setAllocationMode(Object.keys(payrollFields).reduce((acc, key) => {
      acc[key] = 'direct';
      return acc;
    }, {}));
  }, [payrollFields]);

  useEffect(() => {
    if (ctc > 0) {
      // Reset payroll data with zeros
      setPayrollData(Object.fromEntries(Object.keys(payrollFields).map(key => [key, 0])));

      // Reset remaining allocation
      setRemainingAllocation({ percentage: 100, amount: ctc });
    }
  }, [ctc]);

  useEffect(() => {
    // Calculate remaining allocation whenever payroll data changes
    const totalPercentage = Object.keys(payrollData).reduce((sum, key) => {
        if (allocationMode[key] === 'percentage') {
          return sum + (parseFloat(payrollData[key]) || 0);
        }
        return sum + (parseFloat((payrollData[key]/ctc)*100) || 0);
    }, 0);

    const totalDirectAmount = Object.keys(payrollData).reduce((sum, key) => {
      if (allocationMode[key] === 'percentage') {
        return sum + (parseFloat((payrollData[key]*ctc)/100) || 0);
      }
      return sum + (parseFloat(payrollData[key]) || 0);
    }, 0);

    setRemainingAllocation({
      percentage: parseInt(Math.max(0, 100 - totalPercentage)*100)/100,
      amount: Math.max(0, ctc - totalDirectAmount)
    });
  }, [payrollData, allocationMode]);

  const handleCTCChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCTC(parseInt(value) || 0);
    }
  };

  const handleAllocationModeChange = (key, mode) => {
    setAllocationMode(prev => ({ ...prev, [key]: mode }));
    setPayrollData(prev => ({ ...prev, [key]: 0 }));
  };

  const handlePayrollChange = (e, key) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const numValue = parseInt(value) || 0;
      
      if (allocationMode[key] === 'percentage') {
        // Check if new percentage exceeds 100percentage
        const otherPercentages = Object.keys(payrollData).reduce((sum, k) => {
          if (k !== key && allocationMode[k] === 'percentage') {
            return sum + (parseFloat(payrollData[k]) || 0);
          }
          return sum;
        }, 0);

        if (numValue + otherPercentages > 100) {
          toast.error("Total percentage cannot exceed 100%");
          return;
        }
        
        // Update the amount based on percentage
        const amount = (numValue / 100) * ctc;
        setPayrollData(prev => ({ ...prev, [key]: value }));
      } else {
        // Check if new amount exceeds CTC
        const otherAmounts = Object.keys(payrollData).reduce((sum, k) => {
          if (k !== key && allocationMode[k] === 'direct') {
            return sum + (parseFloat(payrollData[k]) || 0);
          }
          return sum;
        }, 0);

        if (numValue + otherAmounts > ctc) {
          toast.error("Total amount cannot exceed CTC");
          return;
        }

        setPayrollData(prev => ({ ...prev, [key]: value }));
      }
    }
  };

  const getMonthlyValue = (key) => {
    const value = parseFloat(payrollData[key]) || 0;
    if (allocationMode[key] === 'percentage') {
      return Math.round((value / 100) * ctc / 12);
    }
    return Math.round(value / 12);
  };

  const getYearlyValue = (key) => {
    const value = parseFloat(payrollData[key]) || 0;
    if (allocationMode[key] === 'percentage') {
      return Math.round((value / 100) * ctc);
    }
    return value;
  };

  const totalMonthly = Object.keys(payrollFields).reduce((sum, key) => sum + getMonthlyValue(key), 0);
  const totalYearly = Object.keys(payrollFields).reduce((sum, key) => sum + getYearlyValue(key), 0);

  return (
    <Box>
      <Box sx={{ mb: 3, mt: 2 }}>
        <TextField
          label="Annual CTC"
          type="text"
          value={ctc}
          onChange={handleCTCChange}
          fullWidth
          variant="outlined"
          size="small"
        />
      </Box>

      {ctc > 0 && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Remaining Allocation:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2">
                Percentage: {remainingAllocation.percentage}%
              </Typography>
              <Typography variant="body2">
                Amount: ₹{remainingAllocation.amount}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={100 - remainingAllocation.percentage} 
              sx={{ mt: 1 }}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  <TableCell sx={{width:100}}>Mode</TableCell>
                  <TableCell sx={{width:150}}>Value</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>Yearly</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(payrollFields).map((key) => (
                  <TableRow key={key}>
                    <TableCell>{payrollFields[key].label}</TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={allocationMode[key]}
                          onChange={(e) => handleAllocationModeChange(key, e.target.value)}
                        >
                          <MenuItem value="direct">₹</MenuItem>
                          <MenuItem value="percentage">%</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        size="small"
                        value={payrollData[key]}
                        onChange={(e) => handlePayrollChange(e, key)}
                        fullWidth
                        InputProps={{
                          endAdornment: allocationMode[key] === 'percentage' ? '%' : '₹'
                        }}
                      />
                    </TableCell>
                    <TableCell>₹{getMonthlyValue(key)}</TableCell>
                    <TableCell>₹{getYearlyValue(key)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>₹{totalMonthly}</TableCell>
                  <TableCell>₹{totalYearly}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
});

const AddEmployees = ({ open, onClose, onSubmit }) => {
  if (!open) return;
  const {
    employeeFields,
    setEmployeeFields,
    refreshFormUuid
  } = useApp();

  const employeeFormRef = useRef();
  const payrollTableRef = useRef();

  useEffect(()=>{
    refreshFormUuid();
    fetchPayrollComponents();
  },[])

  const [payrollFields, setPayrollFields] = useState({});
  const [payrollData, setPayrollData] = useState({});

  const fetchPayrollComponents = async () => {
    try {
      const response = await getPayrollComponentPoliciesService();
      if (response.success) {
        const fields = response.data.reduce((acc, component) => {
          acc[component.name] = { 
            label: component.name,
            type: component.type,
            is_basic_salary: component.is_basic_salary
          };
          return acc;
        }, {});
        setPayrollFields(fields);
        setPayrollData(Object.fromEntries(Object.keys(fields).map(key => [key, 0])));
      }
    } catch (error) {
      toast.error("Failed to fetch payroll components");
    }
  };

  const handleSubmit = async () => {
    const employeeData = employeeFormRef?.current?.formData;
    
    // Validate payroll data first
    if (!payrollTableRef.current?.validate()) {
      return;
    }

    employeeFormRef?.current?.setLoadingState('Creating Employee...');
    try {
      const ctc = payrollTableRef.current.getCTC();
      const allocationMode = payrollTableRef.current.getAllocationMode();

      // Convert percentage-based values to actual amounts
      const finalPayrollData = {};
      Object.keys(payrollData).forEach(key => {
        if (allocationMode[key] === 'percentage') {
          finalPayrollData[key] = Math.round((parseFloat(payrollData[key]) / 100) * ctc);
        } else {
          finalPayrollData[key] = parseInt(payrollData[key]);
        }
      });
      
      await createEmployeeService(employeeData, finalPayrollData);
      toast.success("Employee added successfully");
      // onSubmit();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add employee");
    } finally {
      employeeFormRef?.current?.setLoadingState(null);
    }
  };

  return (
    <ActionPopup open={open} onClose={onClose} title="Add Employee" actions={[
      <CustomButton
          title={employeeFormRef?.current?.loadingState || 'Submit'}
          variant="contained"
          color="primary"
          size="small"
          disabled={employeeFormRef?.current?.loadingState?true:false}
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
      <PayrollTable 
        ref={payrollTableRef}
        payrollFields={payrollFields} 
        payrollData={payrollData} 
        setPayrollData={setPayrollData} 
      />
    </ActionPopup>
  );
};

export default AddEmployees;