import getAllBranchesService from "@/services/getAllBranchesService";
import getAllDepartmentsService from "@/services/getAllDepartmentsService";
import getAllQualificationsService from "@/services/getAllQualificationsService";
import getAllRolesService from "@/services/getAllRolesService";
import getDepartmentDesignationsService from "@/services/getDepartmentDesignationsService";
import getDepartmentProcessesService from "@/services/getDepartmentProcessesService";
import React, { createContext, useState, useEffect, useContext } from "react";
import z from "zod";
import { v4 } from "uuid";
import { useAuth } from "./AuthContext";
import getShiftsService from "@/services/shiftServices/getShiftsService";
import getShiftBatchesService from "@/services/shiftServices/getShiftBatchesService";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { id : employeeId } = useAuth();
    const [formUuid, setFormUuid] = useState(v4());
    const refreshFormUuid = () => {
        setFormUuid(v4());
    }
    const [employeeFields, setEmployeeFields] = useState({
        photo_doc: { 
          required: false, 
          inputType: 'photo', 
          label: "Profile Photo",
          key: `employee/${employeeId}/onboarding-${formUuid}/photo`,
          allowedTypes: ['image/jpeg', 'image/png'],
          unsupportedTypeMessages: "Only PNG and JPG files are supported"
        },
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
        qualification_id: { 
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
        department_id: { 
          required: true, 
          inputType: 'select', 
          label: "Department", 
          options: [],
          dependOn: null,
          getOptions: getAllDepartmentsService,
        },
        designation_id: { 
          required: true, 
          inputType: 'select', 
          label: "Designation", 
          options: [],
          dependOn: 'department_id',
          getOptions: getDepartmentDesignationsService
        },
        process_id: { 
          required: true, 
          inputType: 'select', 
          label: "Process", 
          options: [],
          dependOn: 'department_id',
          getOptions: getDepartmentProcessesService
        },
        branch_id: {
          required: true,
          inputType: 'select', 
          label: "Branch",
          options: [],
          dependOn: null,
          getOptions: getAllBranchesService
        },
        aadhaar_doc: {
          required: false,
          inputType: 'file',
          label: "Aadhaar Upload",
          key: `employee/${employeeId}/onboarding-${formUuid}/aadhaar_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        pan_doc: {
          required: false,
          inputType: 'file',
          label: "PAN Upload",
          key: `employee/${employeeId}/onboarding-${formUuid}/pan_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        tan_doc: {
          required: false,
          inputType: 'file',
          label: "Tan Upload",
          key: `employee/${employeeId}/onboarding-${formUuid}/tan_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        secondary_education_doc : {
          required: false,
          inputType: 'file',
          label: "Secondary Education Document",
          key: `employee/${employeeId}/onboarding-${formUuid}/secondary_education_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        intermediate_education_doc: {
          required: false,
          inputType: 'file',
          label: "Intermediate Education Document",
          key: `employee/${employeeId}/onboarding-${formUuid}/intermediate_education_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        graduation_doc: {
          required: false,
          inputType: 'file',
          label: "Graduation Document",
          key: `employee/${employeeId}/onboarding-${formUuid}/graduation_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        post_graduation_doc: {
          required: false,
          inputType: 'file',
          label: "Post Graduation Document",
          key: `employee/${employeeId}/onboarding-${formUuid}/post_graduation_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        passbook_doc: {
          required: false,
          inputType: 'file',
          label: "Passbook Document",
          key: `employee/${employeeId}/onboarding-${formUuid}/passbook_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        experience_doc: {
          required: false,
          inputType: 'file',
          label: "Experience or Relieve Document",
          key: `employee/${employeeId}/onboarding-${formUuid}/experience_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        last_three_month_salary_doc: {
          required: false,
          inputType: 'file',
          label: "Last Three Month Salary Document",
          key: `employee/${employeeId}/onboarding-${formUuid}/last_three_month_salary_doc`,
          allowedTypes: ['application/pdf'],
          unsupportedTypeMessages: "Only PDF files are supported"
        },
        Roles: {
          required: false,
          inputType: 'multiselect',
          label: "Roles",
          options: [],
          dependOn: null,
          getOptions: getAllRolesService,
          validation: z.array(z.number())
        }
      });

    const [branchFields, setBranchFields] = useState({
            name: {
                required: true,
                inputType: 'text',
                label: "Name"
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
            }
      })

    const [departmentFields, setDepartmentFields] = useState({
      name: {
        required: true,
        inputType: 'text',
        label: "Name"
      },
      description: {
        required: true,
        inputType: 'text',
        label: "Description"
      }
    }) 

    const [designationFields, setDesignationFields] = useState({
      name: {
        required: true,
        inputType: 'text',
        label: "Name"
      },
      description: {
        required: true,
        inputType: 'text',
        label: "Description"
      }
    })

    const [processFields, setProcessFields] = useState({
      name: {
        required: true,
        inputType: 'text',
        label: "Name"
      },
      description: {
        required: true,
        inputType: 'text',
        label: "Description"
      }
    })

    const [shiftFields, setShiftFields] = useState({
      id : {
        required: false,
        inputType: 'number',
        hidden: true,
        label: "ID",
        validation: z.number().optional(),
      },
      department_id: { 
        required: true, 
        inputType: 'select', 
        label: "Department", 
        options: [],
        dependOn: null,
        getOptions: getAllDepartmentsService,
      },
      process_id: { 
        required: true, 
        inputType: 'select', 
        label: "Process", 
        options: [],
        dependOn: 'department_id',
        getOptions: getDepartmentProcessesService
      },
      name: {
        required: true,
        inputType: 'text',
        label: "Name"
      },
      start: {
        required: true,
        inputType: 'time',
        label: "Start Time"
      },
      end: {
        required: true,
        inputType: 'time',
        label: "End Time"
      },
      work_duration_minutes: {
        required: true,
        inputType: 'number',
        label: "Work Duration (in minutes)",
        validation: z.coerce.number().int().min(1, "Must be at least 1 minute"),
      },
      personal_break_duration_minutes: {
        required: true,
        inputType: 'number',
        label: "Personal Break Duration (in minutes)",
        validation: z.coerce.number().int().min(0, "Cannot be Negative"),
      },
      batches: {
        required: true,
        inputType: 'array',
        label: "Batches",
        validation: z.array(z.object({
          id: z.number().optional(),
          name: z.string(),
          breaks: z.array(z.object({
            id: z.number().optional(),
            name: z.string(),
            start: z.string(),
            end: z.string()
          })).optional()
        })).min(1, "At least one batch is required"),
        fields: {
          id: {
            required: false,
            inputType: 'number',
            label: "ID",
            hidden: true,
          },
          name: {
            required: true,
            inputType: 'text',
            label: "Name"
          },
          breaks: {
            required: false,
            inputType: 'array',
            label: "Breaks",
            fields: {
              id: {
                required: false,
                inputType: 'number',
                label: "ID",
                hidden: true
              },
              name: {
                required: true,
                inputType: 'text',
                label: "Name"
              },
              start: {
                required: true,
                inputType: 'time',
                label: "Start Time"
              },
              end: {
                required: true,
                inputType: 'time',
                label: "End Time"
              },
            }
          }
        },
      }
    })

    const [assignShiftFields, setAssignShiftFields] = useState({
      department_id: {
        required: true,
        inputType: 'select',
        label: "Department",
        options: [],
        dependOn: null,
        getOptions: getAllDepartmentsService,
        validation: z.string()
      },
      process_id: {
        required: true,
        inputType: 'select',
        label: "Process",
        options: [],
        dependOn: 'department_id',
        getOptions: getDepartmentProcessesService,
        validation: z.string()
      },
      shift_id: {
        required: true,
        inputType: 'select',
        label: "Shift",
        options: [],
        dependOn: 'process_id',
        getOptions: getShiftsService,
        validation: z.number()
      },
      batch_id: {
        required: true,
        inputType: 'select',
        label: "Batch",
        options: [],
        dependOn: 'shift_id',
        getOptions: getShiftBatchesService,
        validation: z.number()
      },
    })
    return (
        <AppContext.Provider value={{
            employeeFields,
            setEmployeeFields,
            branchFields,
            setBranchFields,
            departmentFields,
            setDepartmentFields,
            designationFields,
            setDesignationFields,
            processFields,
            setProcessFields,
            shiftFields,
            setShiftFields,
            assignShiftFields,
            setAssignShiftFields,
            refreshFormUuid
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
