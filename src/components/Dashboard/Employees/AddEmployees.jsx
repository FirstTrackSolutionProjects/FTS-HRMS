import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MuiFileInput } from 'mui-file-input';
import ActionPopup from '../../CustomComponents/ActionPopup';
import CustomButton from '../../CustomComponents/CustomButton';
import { z } from "zod";
import FileAttachmentIcon from '../../../icons/FileAttachmentIcon'
import ClearFieldIcon from "../../../icons/ClearFieldIcon";
import getAllDepartmentsService from "../../../services/getAllDepartmentsService";
import getAllRolesService from "../../../services/getAllRolesService";
import getDepartmentDesignationsService from "../../../services/getDepartmentDesignationsService";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "../../../contexts/AuthContext";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import getDepartmentProcessesService from "../../../services/getDepartmentProcessesService";
import getAllQualificationsService from "../../../services/getAllQualificationsService";
import MultiSelect from "../../CustomComponents/MultiSelect";
import createEmployeeService from "../../../services/createEmployeeService";
import getS3PutUrlService from "../../../services/getS3PutUrlService";
import s3FileUploadService from "../../../services/s3FileUploadService";

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
  const { id } = useAuth()
  const [employeeFields, setFields] = useState({
    first_name: { 
      required: true, 
      inputType: 'text', 
      label: "First Name"
    },
    last_name: { 
      required: false, 
      inputType: 'text', 
      label: "Last Name" 
    },
    mobile: { 
      required: true, 
      inputType: 'text', 
      label: "Mobile Number", 
      validation: z.string().regex(/\d{10}/, "Invalid Mobile Number") 
    },
    email: { 
      required: true, 
      inputType: 'text', 
      label: "Email Address", 
      validation: z.string().email("Invalid Email") 
    },
    address: { 
      required: true, 
      inputType: 'text', 
      label: "Address" 
    },
    city: { 
      required: true, 
      inputType: 'text', 
      label: "City" 
    },
    state: { 
      required: true, 
      inputType: 'text', 
      label: "State" 
    },
    pincode: { 
      required: true, 
      inputType: 'text', 
      label: "Pincode", 
      validation: z.string().regex(/\d{6}/, "Invalid Pincode") 
    },
    country: { 
      required: true, 
      inputType: 'text', 
      label: "Country" 
    },
    aadhaar: { 
      required: true, 
      inputType: 'text', 
      label: "Aadhaar Number", 
      validation: z.string().regex(/\d{12}/, "Invalid Aadhaar Number")
    },
    pan: { 
      required: true, 
      inputType: 'text', 
      label: "PAN Number", 
      validation: z.string().regex(/[A-Z]{5}\d{4}[A-Z]{1}/, "Invalid PAN Number") 
    },
    tan: { 
      required: true, 
      inputType: 'text', 
      label: "Tan Number"
    },
    qualification: { 
      required: true, 
      inputType: 'select', 
      label: "Qualification",
      options: [],
      dependOn: null,
      getOptions: getAllQualificationsService,
      validation: z.number().int("Qualification is required")
    },
    dob: { 
      required: true, 
      inputType: 'date', 
      label: "Date of Birth" 
    },
    department: { 
      required: true, 
      inputType: 'select', 
      label: "Department", 
      options: [],
      dependOn: null,
      getOptions: getAllDepartmentsService,
    },
    designation: { 
      required: true, 
      inputType: 'select', 
      label: "Designation", 
      options: [],
      dependOn: 'department',
      getOptions: getDepartmentDesignationsService
    },
    process: { 
      required: true, 
      inputType: 'select', 
      label: "Process", 
      options: [],
      dependOn: 'department',
      getOptions: getDepartmentProcessesService
    },
    photo: { 
      required: false, 
      inputType: 'file', 
      label: "Profile Photo" ,
      allowedTypes: ['image/jpeg', 'image/png'],
      unsupportedTypeMessages: "Only PNG and JPG files are supported"
    },
    aadhaar_doc: {
      required: false,
      inputType: 'file',
      label: "Aadhaar Upload",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    pan_doc: {
      required: false,
      inputType: 'file',
      label: "PAN Upload",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    tan_doc: {
      required: false,
      inputType: 'file',
      label: "Tan Upload",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    secondary_education_doc : {
      required: false,
      inputType: 'file',
      label: "Secondary Education Document",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    intermediate_education_doc: {
      required: false,
      inputType: 'file',
      label: "Intermediate Education Document",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    graduation_doc: {
      required: false,
      inputType: 'file',
      label: "Graduation Document",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    post_graduation_doc: {
      required: false,
      inputType: 'file',
      label: "Post Graduation Document",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    passbook_doc: {
      required: false,
      inputType: 'file',
      label: "Passbook Document",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    experience_doc: {
      required: false,
      inputType: 'file',
      label: "Experience or Relieve Document",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    },
    last_three_month_salary_doc: {
      required: false,
      inputType: 'file',
      label: "Last Three Month Salary Document",
      allowedTypes: ['application/pdf'],
      unsupportedTypeMessages: "Only PDF files are supported"
    }
  });
  
  const payrollFields = {
    basic_salary: { label: "Basic Salary" },
    conveyance_allowance: { label: "Conveyance Allowance"},
    house_rent_allowance: { label: "House Rent Allowance" },
    mess_allowance: { label: "Mess Allowance" },
    medical_allowance: { label: "Medical Allowance" },
  }

  const employeeSchema = z.object(
    Object.keys(employeeFields).reduce((schema, key) => {
      if (employeeFields[key].validation) {
        schema[key] = employeeFields[key].validation;
      } else if (employeeFields[key].required) {
        schema[key] = z.string().min(1, `${employeeFields[key].label} is required`);
      }
      return schema;
    }, {})
  );

  const [employeeData, setEmployeeData] = useState(Object.fromEntries(Object.keys(employeeFields).map(key => [key, ''])));
  const prevEmployeeData = useRef(employeeData);
  const [files, setFiles] = useState(
    Object.keys(employeeFields)
      .filter((key) => employeeFields[key]?.inputType === "file")
      .reduce((acc, key) => {
        acc[key] = null;
        return acc;
      }, {})
  );
  const [formSessionUuid, setFormSessionUuid] = useState(null)
  const [loadingState, setLoadingState] = useState(null);
  const [uploadCompleted, setUploadCompleted] = useState(null);


  const [payrollData, setPayrollData] = useState(Object.fromEntries(Object.keys(payrollFields).map(key => [key, 0])));

  const [roles, setRoles] = useState([])
  const [roleIds, setRoleIds] = useState([]);

  const showAllRoles = async () => {
    try{
      const roles = await getAllRolesService();
      setRoles(roles);
    } catch(err){
      toast.error(err);
    }
  }

  useEffect(() => {
    const changedFields = Object.keys(employeeData).filter(
      (key) => employeeData[key] !== prevEmployeeData.current[key]
    );

    if (changedFields.length > 0) {
      Object.keys(employeeFields).map(async (key)=>{
        if (employeeFields[key].inputType == "select"){
          const dependencyChanged = changedFields.includes(employeeFields[key]?.dependOn);
          if (dependencyChanged){
            try {
              const options = await employeeFields[key].getOptions(employeeData[employeeFields[key]?.dependOn])
              setFields((prevData) => ({...prevData, [key]: {...employeeFields[key], options: options} }));
            } catch (err) {
              toast.error(`Failed to fetch ${employeeFields[key].label}`);
            }
          }
        }
      })
    }

    prevEmployeeData.current = employeeData;
  }, [employeeData]);

  useEffect(() => {
    setFormSessionUuid(uuidv4());
    showAllRoles()
    Object.keys(employeeFields).map(async (key)=>{
      if (employeeFields[key].inputType == "select"){
          if (employeeFields[key]?.dependOn) return;
          try {
            const options = await employeeFields[key].getOptions()
            setFields((prevData) => ({...prevData, [key]: {...employeeFields[key], options: options} }));
          } catch (err) {
            toast.error(`Failed to fetch ${employeeFields[key].label}`);
          }
      }
    })
  },[])

  const handleEmployeeDataChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEmployeeFileChange = (value, name) => {
    if (!value){
      setFiles((prevFiles) => ({ ...prevFiles, [name]: null }));
      return;
    }
    if (!employeeFields[name]?.allowedTypes?.includes(value.type)){
      toast.error(employeeFields[name]?.unsupportedTypeMessages);
      setFiles((prevFiles) => ({ ...prevFiles, [name]: null }));
      return;
    }
    setEmployeeData((prevData) => ({ ...prevData, [name]: ''}));
    setFiles((prevFiles) => ({...prevFiles, [name]: value }));
};
const handleUpload = async (name) => {
  try {
    if (!files[name] || employeeData[name]) return;
    const key = `employee/${id}/onboarding-${formSessionUuid}/${name}`;
    const file = files[name];
    const filetype = file.type;
    const uploadUrl = await getS3PutUrlService(key, filetype);
    await s3FileUploadService(uploadUrl, file, filetype)
    return { success: true, key: name, value: key };
  } catch (error) {
    toast.error(`Error uploading ${employeeFields[name]?.label}, Please try again`);
    return { success: false, key: name };
  }
};

const uploadEmployeeFiles = async (e) => {
  e.preventDefault();
  setUploadCompleted(null)
  setLoadingState('Uploading Files...');
  try {
    const uploadResults = await Promise.all(
      Object.keys(files).map((key) => handleUpload(key))
    );
    const failedUploads = uploadResults.filter(result => result && !result?.success)
    if (failedUploads.length) {
      toast.error(`Failed to upload files for ${failedUploads.map(upload => upload.key).join(', ')}`);
      return;
    }
    const successfulUploads = uploadResults.filter(result => result && result.success);
    const newEmployeeData = { ...employeeData };
    
    successfulUploads.forEach(({ key, value }) => {
      newEmployeeData[key] = value;
    });
    await new Promise(resolve => {
      setEmployeeData(newEmployeeData);
      resolve();
    });

    setUploadCompleted(true);
  } catch (error) {
    toast.error("Error submitting form: " + error.message);
  } finally {
    setLoadingState(null);
  }
}
  useEffect(()=>{
    if (uploadCompleted){
      handleSubmit();
    }
  },[uploadCompleted])

  const handleSubmit = async () => {
    setLoadingState('Creating Employee...');
    try {
      employeeSchema.parse(employeeData);
      await createEmployeeService(employeeData, payrollData, roleIds)
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
          onClick={uploadEmployeeFiles}
          sx={{ marginTop: 2, width: '100%' }}
        />
    ]}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '70%', overflow:'hidden', padding:1 }}>
        <Grid container spacing={2}>
          {Object.keys(employeeFields).map((key) => (
            employeeFields[key].inputType === 'select' ? (
              <Grid item xs={12} sm={6} key={key}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ backgroundColor: 'white'}}>{employeeFields[key].label}{employeeFields[key].required?'*':''}</InputLabel>
                  <Select
                    name={key}
                    value={employeeData[key]}
                    onChange={handleEmployeeDataChange}
                    disabled={employeeFields[key].disabled || !employeeFields[key]?.options?.length}
                    fullWidth
                  >
                    {employeeFields[key]?.options?.map((option) => {
                      return <MenuItem key={option?.id} value={option?.id}>{option?.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Grid>
            ) : employeeFields[key].inputType === 'file' ? (
              <Grid item xs={12} sm={6} key={key}>
                <MuiFileInput
                  label={`${employeeFields[key].label}${employeeFields[key].required?'*':''}`}
                  value={files[key]}
                  placeholder={'Select File'}
                  size="small"
                  onChange={(value) => handleEmployeeFileChange(value, key)}
                  fullWidth
                  clearIconButtonProps={{
                    title: "Remove",
                    children: <ClearFieldIcon />
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FileAttachmentIcon />
                      </InputAdornment>
                    )
                  }}
                />
                {employeeData[key]?<Box>Uploaded</Box>:null}
              </Grid>
            ) : employeeFields[key].inputType === "date" ? (
              <Grid item xs={12} sm={6} key={key}>
                  <TextField
                  label={`${employeeFields[key].label}${employeeFields[key].required ? '*' : ''}`}
                  variant="outlined"
                  size="small"
                  type="date"
                  name={key}
                  value={employeeData[key]}
                  onChange={handleEmployeeDataChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }} // Fixes label overlapping issue
                />
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={`${employeeFields[key].label}${employeeFields[key].required?'*':''}`}
                  variant="outlined"
                  size="small"
                  name={key}
                  value={employeeData[key]}
                  onChange={handleEmployeeDataChange}
                  fullWidth
                />
              </Grid>
            )
          ))}
        </Grid>
      </Box>
      <MultiSelect options={roles} selectedValues={roleIds} setSelectedValues={setRoleIds} label={'Assign Role'} />
      <PayrollTable payrollFields={payrollFields} payrollData={payrollData} setPayrollData={setPayrollData} />
    </ActionPopup>
  );
};

export default AddEmployees;