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
import calculateLeaveDays from "@/helpers/calcLeaveDays";
import { EMPLOYEE_REGEX } from "@/regex";
import EmployeeOptionComponent from "@/components/CustomComponents/SelectOptionComponents/EmployeeOptionComponent";
import getAutocompleteEmployeeListByBatchAndBranchService from "@/services/employeeServices/getEmployeesByBatchService";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { id : employeeId } = useAuth();
    const [formUuid, setFormUuid] = useState(v4());
    const refreshFormUuid = () => {
        setFormUuid(v4());
    }

    ///////////////////////////////////FORM FIELDS//////////////////////////////////////////
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
        mothers_name: {
          required: true,
          inputType: 'text',
          label: "Mother's Name",
        },
        fathers_name: {
          required: true,
          inputType: 'text',
          label: "Father's Name",
        },
        guardian_name: {
          inputType: 'text',
          label: "Guardian's Name",
        },
        guardian_relation: {
          inputType: 'select',
          label: "Guardian's Relation",
          options: [],
          getOptions: () => ([
            { id: "Brother", name: "Brother" },
            { id: "Sister", name: "Sister" },
            { id: "Son", name: "Son" },
            { id: "Daughter", name: "Daughter" },
            { id: "Grandfather", name: "Grandfather" },
            { id: "Grandmother", name: "Grandmother" },
            { id: "Uncle", name: "Uncle" },
            { id: "Aunt", name: "Aunt" },
            { id: "Cousin", name: "Cousin" },
            { id: "Nephew", name: "Nephew" },
            { id: "Niece", name: "Niece" },
            { id: "Father-in-law", name: "Father-in-law" },
            { id: "Mother-in-law", name: "Mother-in-law" },
            { id: "Brother-in-law", name: "Brother-in-law" },
            { id: "Sister-in-law", name: "Sister-in-law" },
            { id: "Son-in-law", name: "Son-in-law" },
            { id: "Daughter-in-law", name: "Daughter-in-law" },
            { id: "Spouse", name: "Spouse" },
            { id: "Husband", name: "Husband" },
            { id: "Wife", name: "Wife" },
            { id: "Stepfather", name: "Stepfather" },
            { id: "Stepmother", name: "Stepmother" },
            { id: "Stepbrother", name: "Stepbrother" },
            { id: "Stepsister", name: "Stepsister" },
            { id: "Guardian", name: "Guardian" },
            { id: "Other", name: "Other" }
          ])
        },
        parents_guardian_mobile: {
          required: true,
          inputType: 'text',
          label: "Parents/Guardian's Mobile",
          validation: z.string().regex(/\d{10}/, "Invalid Mobile Number") 
        },
        age: {
          required: true,
          inputType: 'number',
          label: "Age",
        },
        gender: {
          required: true,
          inputType: 'select',
          label: "Gender",
          options: [],
          getOptions: () => ([
            {
              id: 'Male',
              name: 'Male',
            },
            {
              id: 'Female',
              name: 'Female'
            }
          ])
        },
        dob: {
          required: true,
          inputType: 'date',
          label: "Date of Birth"
        },
        marital_status: {
          label: "Marital Status",
          inputType: 'select',
          options: [],
          getOptions: () => ([
            {
              id: 'Single',
              name: 'Single'
            },
            {
              id: 'Married',
              name: 'Married'
            }
          ])
        },
        blood_group: {
          required: true,
          inputType: 'select',
          label: "Blood Group",
          options: [],
          getOptions: () => ([
            {
              id: 'A+',
              name: 'A+'
            },
            {
              id: 'A-',
              name: 'A-'
            },
            {
              id: 'B+',
              name: 'B+'
            },
            {
              id: 'B-',
              name: 'B-'
            },
            {
              id: 'AB+',
              name: 'AB+'
            },
            {
              id: 'AB-',
              name: 'AB-'
            },
            {
              id: 'O+',
              name: 'O+'
            },
            {
              id: 'O-',
              name: 'O-'
            }
          ])
        },
        landmark: {
          required: true,
          inputType: 'text',
          label: "Landmark"
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
        permanent_address_landmark: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Landmark",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_street_address: {
          required: true,
          inputType: 'text',
          label: "Permanent Street Address",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_city: {
          required: true,
          inputType: 'text',
          label: "Permanent Address City",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_state: {
          required: true,
          inputType: 'text',
          label: "Permanent Address State",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_country: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Country",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_postal_code: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Pincode",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        is_permanent_address_same: {
          required: true,
          inputType: 'switch',
          label: "Is Permanent Address Same as Current Address",
          colSpan: 12
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
        qualification: { 
          required: true, 
          inputType: 'select', 
          label: "Qualification",
          options: [],
          dependOn: null,
          getOptions: () => ([
            {
              id: "12th",
              name: "12th"
            },
            {
              id: "Graduation",
              name: "Graduation"
            },
            {
              id: "Post Graduation",
              name: "Post Graduation"
            }
          ]),
          validation: z.string({
            required_error: "Qualification is required",
            invalid_type_error: "Qualification must be a string"
          })
          .trim()
          .min(1, "Qualification must be at least 1 character long")
          .max(100, "Qualification must be at most 100 characters long")
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
          dependOn: ['department_id'],
          getOptions: getDepartmentDesignationsService
        },
        process_id: { 
          required: true, 
          inputType: 'select', 
          label: "Process", 
          options: [],
          dependOn: ['department_id'],
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
        dependOn: ['department_id'],
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
        colSpan: 12
      },
      batches: {
        required: true,
        inputType: 'array',
        label: "Batches",
        colSpan: 12,
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
            label: "Name",
            colSpan:12
          },
          breaks: {
            required: false,
            inputType: 'array',
            label: "Breaks",
            colSpan: 12,
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
        dependOn: ['department_id'],
        getOptions: getDepartmentProcessesService,
        validation: z.string()
      },
      shift_id: {
        required: true,
        inputType: 'select',
        label: "Shift",
        options: [],
        dependOn: ['process_id'],
        getOptions: getShiftsService,
        validation: z.number()
      },
      batch_id: {
        required: true,
        inputType: 'select',
        label: "Batch",
        options: [],
        dependOn: ['shift_id'],
        getOptions: getShiftBatchesService,
        validation: z.number()
      },
    })

    const [leavePolicyFields, setLeavePolicyFields] = useState({
      name: {
        required: true,
        inputType: 'text',
        label: "Leave Name",
        validation: z.string().min(5, "Leave name should be atleast 5 characters")
      },
      applicable_time_from_onboard:{
        required: true,
        inputType: 'number',
        label: "Applicable Time From Onboard",
        validation: z.coerce.number().int().min(0, "Applicable Time From Onboard cannot be negative")
      },
      paid_leave_granted_per_month: {
        required: true,
        inputType: 'number',
        label: "Paid Leave Granted Per Month",
        validation: z.coerce.number().int().min(0, "Paid Leave Granted Per Month cannot be negative")
      },
      is_paid_leave: {
        required: true,
        inputType: 'switch',
        label: "Paid Leave",
        validation: z.boolean(),
      },
      is_special_leave: {
        required: true,
        inputType: 'switch',
        label: "Special Leave",
        validation: z.boolean()
      },
      is_ondemand_leave: {
        required: true,
        inputType: 'switch',
        label: "On Demand Leave",
        validation: z.boolean()
      }
    })

    const [leaveApplicationFields, setLeaveApplicationFields] = useState({
      leave_name: {
        required: true,
        inputType: 'text',
        label: "Leave Name",
      },
      start: {
        required: true,
        inputType: 'date',
        label: "Start Date",
      },
      end: {
        required: true,
        inputType: 'date',
        label: "End Date",
      },
      leave_days: {
        required: true,
        inputType: 'expression',
        label: "Leave Days",
        defaultValue: 0,
        function: (formData) => calculateLeaveDays(formData.start, formData.end),
        validation: z.coerce.number().int().min(1, "Leave Days must be atleast 1")
      },
      reason: {
        required: true,
        inputType: 'textField',
        maxLength: 250,
        label: "Reason",
        colSpan: 12
      },
      supporting_document: {
        required: false,
        inputType: 'file',
        label: "Supporting Document",
        key: `employee/${employeeId}/leave-application-docs/${formUuid}`,
        allowedTypes: ['application/pdf'],
        unsupportedTypeMessages: "Only PDF files are supported"
      }
    })

    const [reviewLeaveApplicationFields, setReviewLeaveApplicationFields] = useState({
      employee_id: {
        required: true,
        inputType: 'text',
        label: "Applicant ID"
      },
      employee_first_name: {
        required: true,
        inputType: 'text',
        label: "Applicant First Name"
      },
      employee_last_name: {
        required: true,
        inputType: 'text',
        label: "Applicant Last Name"
      },
      employee_email: {
        required: true,
        inputType: 'email',
        label: "Applicant Email"
      },
      leave_name: {
        required: true,
        inputType: 'text',
        label: "Leave Name",
      },
      leave_start_date: {
        required: true,
        inputType: 'date',
        label: "Start Date",
      },
      leave_end_date: {
        required: true,
        inputType: 'date',
        label: "End Date",
      },
      leave_days: {
        required: true,
        inputType: 'expression',
        label: "Leave Days",
        defaultValue: 0,
        function: (formData) => calculateLeaveDays(formData.start, formData.end),
        validation: z.coerce.number().int().min(1, "Leave Days must be atleast 1")
      },
      leave_reason: {
        required: true,
        inputType: 'textField',
        maxLength: 250,
        label: "Reason"
      },
      supporting_document: {
        required: false,
        inputType: 'file',
        label: "Supporting Document",
        key: `employee/${employeeId}/leave-application-docs/${formUuid}`,
        allowedTypes: ['application/pdf'],
        unsupportedTypeMessages: "Only PDF files are supported"
      }
    })

    const [createJoinUsRequestFields, setCreateJoinUsRequestFields] = useState({
      first_name: {
        required: true,
        inputType: 'text',
        label: "First Name",
        validation: z.string().regex(EMPLOYEE_REGEX.FIRST_NAME, "Invalid First Name"),
      },
      last_name: { 
        required: false, 
        inputType: 'text', 
        label: "Last Name",
        validation: z.string().regex(EMPLOYEE_REGEX.LAST_NAME, "Invalid Last Name"),
      },
      mobile: { 
        required: true, 
        inputType: 'text', 
        label: "Mobile Number", 
        validation: z.string().regex(EMPLOYEE_REGEX.MOBILE, "Invalid Mobile Number") 
      },
      email: { 
        required: true, 
        inputType: 'text', 
        label: "Email Address", 
        validation: z.string().regex(EMPLOYEE_REGEX.EMAIL, "Invalid Email")
      },
      interviewer_id: {
        required: true,
        inputType: 'autocomplete',
        label: "Interviewer",
        component: EmployeeOptionComponent,
        options: [],
        dependOn: [],
        getOptions: getAutocompleteEmployeeListByBatchAndBranchService,
        colSpan: 12
      },
      approver_id: {
        required: true,
        inputType: 'autocomplete',
        label: "Approved By",
        component: EmployeeOptionComponent,
        options: [],
        dependOn: [],
        getOptions: getAutocompleteEmployeeListByBatchAndBranchService,
        colSpan: 12
      },
      referral_type: {
        inputType: 'select',
        label: "Referral Type",
        options: [],
        dependOn: [],
        getOptions: () => [
          { id: "EMPLOYEE", name: "EMPLOYEE" },
          { id: "VENDOR", name: "VENDOR" },
        ],
        colSpan: 6
      },
      referrer: {
        inputType: 'text',
        label: "Referrer ID/ Vendor Name",
        colSpan: 6
      },
    })

    const [joinUsRequestSubmissionFields, setJoinUsRequestSubmissionFields] = useState({
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
        mothers_name: {
          required: true,
          inputType: 'text',
          label: "Mother's Name",
        },
        fathers_name: {
          required: true,
          inputType: 'text',
          label: "Father's Name",
        },
        guardian_name: {
          inputType: 'text',
          label: "Guardian's Name",
        },
        guardian_relation: {
          inputType: 'select',
          label: "Guardian's Relation",
          options: [],
          getOptions: () => ([
            { id: "Brother", name: "Brother" },
            { id: "Sister", name: "Sister" },
            { id: "Son", name: "Son" },
            { id: "Daughter", name: "Daughter" },
            { id: "Grandfather", name: "Grandfather" },
            { id: "Grandmother", name: "Grandmother" },
            { id: "Uncle", name: "Uncle" },
            { id: "Aunt", name: "Aunt" },
            { id: "Cousin", name: "Cousin" },
            { id: "Nephew", name: "Nephew" },
            { id: "Niece", name: "Niece" },
            { id: "Father-in-law", name: "Father-in-law" },
            { id: "Mother-in-law", name: "Mother-in-law" },
            { id: "Brother-in-law", name: "Brother-in-law" },
            { id: "Sister-in-law", name: "Sister-in-law" },
            { id: "Son-in-law", name: "Son-in-law" },
            { id: "Daughter-in-law", name: "Daughter-in-law" },
            { id: "Spouse", name: "Spouse" },
            { id: "Husband", name: "Husband" },
            { id: "Wife", name: "Wife" },
            { id: "Stepfather", name: "Stepfather" },
            { id: "Stepmother", name: "Stepmother" },
            { id: "Stepbrother", name: "Stepbrother" },
            { id: "Stepsister", name: "Stepsister" },
            { id: "Guardian", name: "Guardian" },
            { id: "Other", name: "Other" }
          ])
        },
        parents_guardian_mobile: {
          required: true,
          inputType: 'text',
          label: "Parents/Guardian's Mobile",
          validation: z.string().regex(/\d{10}/, "Invalid Mobile Number") 
        },
        age: {
          required: true,
          inputType: 'number',
          label: "Age",
          validation: z.coerce.number().int()
          .min(18, "Age must be at least 18")
          .max(80, "Age must be at most 80")
        },
        gender: {
          required: true,
          inputType: 'select',
          label: "Gender",
          options: [],
          getOptions: () => ([
            {
              id: 'Male',
              name: 'Male',
            },
            {
              id: 'Female',
              name: 'Female'
            }
          ])
        },
        dob: {
          required: true,
          inputType: 'date',
          label: "Date of Birth"
        },
        blood_group: {
          required: true,
          inputType: 'select',
          label: "Blood Group",
          options: [],
          getOptions: () => ([
            {
              id: 'A+',
              name: 'A+'
            },
            {
              id: 'A-',
              name: 'A-'
            },
            {
              id: 'B+',
              name: 'B+'
            },
            {
              id: 'B-',
              name: 'B-'
            },
            {
              id: 'AB+',
              name: 'AB+'
            },
            {
              id: 'AB-',
              name: 'AB-'
            },
            {
              id: 'O+',
              name: 'O+'
            }, 
            {
              id: 'O-',
              name: 'O-'
            }
          ])
        },
        landmark: {
          required: true,
          inputType: 'text',
          label: "Landmark"
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
        permanent_address_landmark: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Landmark",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_street_address: {
          required: true,
          inputType: 'text',
          label: "Permanent Street Address",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_city: {
          required: true,
          inputType: 'text',
          label: "Permanent Address City",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_state: {
          required: true,
          inputType: 'text',
          label: "Permanent Address State",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_country: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Country",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_postal_code: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Pincode",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        is_permanent_address_same: {
          required: true,
          inputType: 'switch',
          label: "Is Permanent Address Same as Current Address",
          colSpan: 12
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
        qualification: { 
          required: true, 
          inputType: 'select', 
          label: "Qualification",
          options: [],
          dependOn: null,
          getOptions: () => ([
            {
              id: "12th",
              name: "12th"
            },
            {
              id: "Graduation",
              name: "Graduation"
            },
            {
              id: "Post Graduation",
              name: "Post Graduation"
            }
          ]),
          validation: z.string({
            required_error: "Qualification is required",
            invalid_type_error: "Qualification must be a string"
          })
          .trim()
          .min(1, "Qualification must be at least 1 character long")
          .max(100, "Qualification must be at most 100 characters long")
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
        }
      });

    const [negativeJoinUsRequestConfirmationFields, setNegativeJoinUsRequestConfirmationFields] = useState({
      reason: {
        required: true,
        inputType: 'text',
        label: "Reason",
      }
    });

    const [employeeOnboardingFields, setEmployeeOnboardingFields] = useState({
      branch_id: {
        required: true,
        inputType: 'select',
        label: "Branch",
        options: [],
        getOptions: getAllBranchesService
      },
      department_id: {
        required: true,
        inputType: 'select',
        label: "Department",
        options: [],
        getOptions: getAllDepartmentsService
      },
      designation_id: {
        required: true,
        inputType: 'select',
        label: "Designation",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentDesignationsService
      },
      process_id: {
        required: true,
        inputType: 'select',
        label: "Process",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentProcessesService
      },
      shift_id: {
        required: true,
        inputType: 'select',
        label: "Shift",
        options: [],
        dependOn: ['process_id'],
        getOptions: getShiftsService,
        validation: z.coerce.number()
      },
      batch_id: {
        required: true,
        inputType: 'select',
        label: "Batch",
        options: [],
        dependOn: ['shift_id'],
        getOptions: getShiftBatchesService,
        validation: z.coerce.number()
      },
      date_of_joining: {
        required: true,
        inputType: 'date',
        label: "Date of Joining"
      },
      probation_period: {
        required: true,
        inputType: 'text',
        label: "Probation Period (In Days)",
        validation: z.string().regex(/^\d{1,3}$/, 'Probation Period should be a number')
      },
      remarks: {
        required: true,
        inputType: 'textarea',
        label: "Remarks",
        maxLength: 250,
        colSpan: 12
      }
    })

    const [reviseEmployeeOnboardingFields, setReviseEmployeeOnboardingFields] = useState({
      branch_id: {
        required: true,
        inputType: 'select',
        label: "Branch",
        options: [],
        getOptions: getAllBranchesService
      },
      department_id: {
        required: true,
        inputType: 'select',
        label: "Department",
        options: [],
        getOptions: getAllDepartmentsService
      },
      designation_id: {
        required: true,
        inputType: 'select',
        label: "Designation",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentDesignationsService
      },
      process_id: {
        required: true,
        inputType: 'select',
        label: "Process",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentProcessesService
      },
      shift_id: {
        required: true,
        inputType: 'select',
        label: "Shift",
        options: [],
        dependOn: ['process_id'],
        getOptions: getShiftsService,
        validation: z.coerce.number()
      },
      batch_id: {
        required: true,
        inputType: 'select',
        label: "Batch",
        options: [],
        dependOn: ['shift_id'],
        getOptions: getShiftBatchesService,
        validation: z.coerce.number()
      },
      date_of_joining: {
        required: true,
        inputType: 'date',
        label: "Date of Joining"
      },
      probation_period: {
        required: true,
        inputType: 'text',
        label: "Probation Period (In Days)",
        validation: z.string().regex(/^\d{1,3}$/, 'Probation Period should be a number')
      },
      remarks: {
        required: true,
        inputType: 'textarea',
        label: "Remarks",
        maxLength: 250,
        colSpan: 12
      },
      reason: {
        required: true,
        inputType: 'textarea',
        label: "Reason for revision",
        maxLength: 250,
        colSpan: 12
      }
    })

    const [assignTrainingFields, setAssignTrainingFields] = useState({
      branch_id: {
        required: true,
        inputType: 'select',
        label: "Branch",
        options: [],
        getOptions: getAllBranchesService
      },
      department_id: {
        required: true,
        inputType: 'select',
        label: "Department",
        options: [],
        getOptions: getAllDepartmentsService
      },
      designation_id: {
        required: true,
        inputType: 'select',
        label: "Designation",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentDesignationsService
      },
      process_id: {
        required: true,
        inputType: 'select',
        label: "Process",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentProcessesService
      },
      shift_id: {
        required: true,
        inputType: 'select',
        label: "Shift",
        options: [],
        dependOn: ['process_id'],
        getOptions: getShiftsService,
        validation: z.coerce.number()
      },
      batch_id: {
        required: true,
        inputType: 'select',
        label: "Batch",
        options: [],
        dependOn: ['shift_id'],
        getOptions: getShiftBatchesService,
        validation: z.coerce.number()
      },
      start_date: {
        required: true,
        inputType: 'date',
        label: "Start Date"
      },
      end_date: {
        required: true,
        inputType: 'date',
        label: "End Date"
      },
      trainer_id: {
        required: true,
        inputType: 'autocomplete',
        label: "Trainer",
        component: EmployeeOptionComponent,
        options: [],
        dependOn: [],
        getOptions: getAutocompleteEmployeeListByBatchAndBranchService,
        colSpan: 12
      },
      remarks: {
        required: true,
        inputType: 'textField',
        maxLength: 250,
        label: "Additional Details",
        colSpan: 12
      },
    })

    const [reviseTrainingFields, setReviseTrainingFields] = useState({
      branch_id: {
        required: true,
        inputType: 'select',
        label: "Branch",
        options: [],
        getOptions: getAllBranchesService
      },
      department_id: {
        required: true,
        inputType: 'select',
        label: "Department",
        options: [],
        getOptions: getAllDepartmentsService
      },
      designation_id: {
        required: true,
        inputType: 'select',
        label: "Designation",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentDesignationsService
      },
      process_id: {
        required: true,
        inputType: 'select',
        label: "Process",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentProcessesService
      },
      shift_id: {
        required: true,
        inputType: 'select',
        label: "Shift",
        options: [],
        dependOn: ['process_id'],
        getOptions: getShiftsService,
        validation: z.coerce.number()
      },
      batch_id: {
        required: true,
        inputType: 'select',
        label: "Batch",
        options: [],
        dependOn: ['shift_id'],
        getOptions: getShiftBatchesService,
        validation: z.coerce.number()
      },
      start_date: {
        required: true,
        inputType: 'date',
        label: "Start Date"
      },
      end_date: {
        required: true,
        inputType: 'date',
        label: "End Date"
      },
      trainer_id: {
        required: true,
        inputType: 'autocomplete',
        label: "Trainer",
        component: EmployeeOptionComponent,
        options: [],
        dependOn: [],
        getOptions: getAutocompleteEmployeeListByBatchAndBranchService,
        colSpan: 12
      },
      remarks: {
        required: true,
        inputType: 'textField',
        maxLength: 250,
        label: "Additional Details",
        colSpan: 12
      },
      reason: {
        required: true,
        inputType: 'textField',
        maxLength: 250,
        label: "Reason for revision",
        colSpan: 12
      }
    })

    const [changeBranchFields,  setChangeBranchFields] = useState({
      branch_id: {
        required: true,
        inputType: 'select',
        label: "New Branch",
        options: [],
        dependOn: [],
        getOptions: getAllBranchesService,
        colSpan: 12
      }
    })

    const [changeDepartmentFields, setChangeDepartmentFields] = useState({
      department_id: {
        required: true,
        inputType: 'select',
        label: "Department",
        options: [],
        dependOn: [],
        getOptions: getAllDepartmentsService,
      },
      designation_id: {
        required: true,
        inputType: 'select',
        label: "Designation",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentDesignationsService,
      },
      process_id: {
        required: true,
        inputType: 'select',
        label: "Process",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentProcessesService,
      },
      shift_id: {
        required: true,
        inputType: 'select',
        label: "Shift",
        options: [],
        dependOn: ['process_id'],
        getOptions: getShiftsService,
        validation: z.coerce.number()
      },
      batch_id: {
        required: true,
        inputType: 'select',
        label: "Batch",
        options: [],
        dependOn: ['shift_id'],
        getOptions: getShiftBatchesService,
        validation: z.coerce.number()
      }
    })

    const [changeDesignationFields, setChangeDesignationFields] = useState({
      department_id: {
        required: true,
        inputType: 'select',
        label: "Department",
        options: [],
        dependOn: [],
        getOptions: getAllDepartmentsService,
        hidden: true
      },
      designation_id: {
        required: true,
        inputType: 'select',
        label: "Designation",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentDesignationsService,
      }
    })

    const [changeProcessFields, setChangeProcessFields] = useState({
      department_id: {
        required: true,
        inputType: 'select',
        label: "Department",
        options: [],
        dependOn: [],
        getOptions: getAllDepartmentsService,
        hidden: true
      },
      process_id: {
        required: true,
        inputType: 'select',
        label: "Process",
        options: [],
        dependOn: ['department_id'],
        getOptions: getDepartmentProcessesService,
      },
      shift_id: {
        required: true,
        inputType: 'select',
        label: "Shift",
        options: [],
        dependOn: ['process_id'],
        getOptions: getShiftsService,
        validation: z.coerce.number()
      },
      batch_id: {
        required: true,
        inputType: 'select',
        label: "Batch",
        options: [],
        dependOn: ['shift_id'],
        getOptions: getShiftBatchesService,
        validation: z.coerce.number()
      }
    })

    const [applyResignationFields, setApplyResignationFields] = useState({
      content: {
        required: true,
        inputType: 'textField',
        maxLength: 2000,
        label: "Resignation Application",
        colSpan: 12
      },
      supporting_document: {
        required: false,
        inputType: 'file',
        label: "Supporting Document",
        key: `employee/${employeeId}/resignation-application-docs/${formUuid}`,
        allowedTypes: ['application/pdf'],
        unsupportedTypeMessages: "Only PDF files are supported"
      }
    })
    
    const [contactSubmissionFields, setContactSubmissionFields] = useState({
      first_name: {
        inputType: 'text',
        label: "First Name",
      },
      last_name: {
        inputType: 'text',
        label: "Last Name",
      },
      email: {
        inputType: 'text',
        label: "Email",
      },
      mobile: {
        inputType: 'text',
        label: "Phone",
      },
      message: {
        inputType: 'textField',
        colSpan:12,
        label: "Message",
      }
    })

    const [careerSubmissionFields, setCareerSubmissionFields] = useState({
      first_name: {
        inputType: 'text',
        label: "First Name",
      },
      last_name: {
        inputType: 'text',
        label: "Last Name",
      },
      email: {
        inputType: 'text',
        label: "Email",
      },
      mobile: {
        inputType: 'text',
        label: "Phone",
      },
      dob: {
        inputType: 'date',
        label: "Date of Birth",
      },
      gender: {
        inputType: 'select',
        options: [],
        label: "Gender",
        getOptions: () => [
          { id: 'Male', name: 'Male' },
          { id: 'Female', name: 'Female' },
        ],
      },
      address: {
        inputType: 'textField',
        label: "Address",
        colSpan: 12
      },
      city: {
        inputType: 'text',
        label: "City",
      },
      state: {
        inputType: 'text',
        label: "State",
      },
      country: {
        inputType: 'text',
        label: "Country",
      },
      pincode: {
        inputType: 'text',
        label: "Pincode",
      },
      description: {
        inputType: 'textField',
        label: "Description",
        colSpan: 12
      },
      cv_doc: {
        inputType: 'file',
        label: "Resume",
      }
    })

    const [employeeProfileFields, setEmployeeProfileFields] = useState({
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
        mothers_name: {
          required: true,
          inputType: 'text',
          label: "Mother's Name",
        },
        fathers_name: {
          required: true,
          inputType: 'text',
          label: "Father's Name",
        },
        guardian_name: {
          inputType: 'text',
          label: "Guardian's Name",
        },
        guardian_relation: {
          inputType: 'select',
          label: "Guardian's Relation",
          options: [],
          getOptions: () => ([
            { id: "Brother", name: "Brother" },
            { id: "Sister", name: "Sister" },
            { id: "Son", name: "Son" },
            { id: "Daughter", name: "Daughter" },
            { id: "Grandfather", name: "Grandfather" },
            { id: "Grandmother", name: "Grandmother" },
            { id: "Uncle", name: "Uncle" },
            { id: "Aunt", name: "Aunt" },
            { id: "Cousin", name: "Cousin" },
            { id: "Nephew", name: "Nephew" },
            { id: "Niece", name: "Niece" },
            { id: "Father-in-law", name: "Father-in-law" },
            { id: "Mother-in-law", name: "Mother-in-law" },
            { id: "Brother-in-law", name: "Brother-in-law" },
            { id: "Sister-in-law", name: "Sister-in-law" },
            { id: "Son-in-law", name: "Son-in-law" },
            { id: "Daughter-in-law", name: "Daughter-in-law" },
            { id: "Spouse", name: "Spouse" },
            { id: "Husband", name: "Husband" },
            { id: "Wife", name: "Wife" },
            { id: "Stepfather", name: "Stepfather" },
            { id: "Stepmother", name: "Stepmother" },
            { id: "Stepbrother", name: "Stepbrother" },
            { id: "Stepsister", name: "Stepsister" },
            { id: "Guardian", name: "Guardian" },
            { id: "Other", name: "Other" }
          ])
        },
        parents_guardian_mobile: {
          required: true,
          inputType: 'text',
          label: "Parents/Guardian's Mobile",
          validation: z.string().regex(/\d{10}/, "Invalid Mobile Number") 
        },
        age: {
          required: true,
          inputType: 'number',
          label: "Age",
          validation: z.coerce.number().int().min(18, "Age must be at least 18").max(80, "Age must be at most 80")
        },
        gender: {
          required: true,
          inputType: 'select',
          label: "Gender",
          options: [],
          getOptions: () => ([
            {
              id: 'Male',
              name: 'Male',
            },
            {
              id: 'Female',
              name: 'Female'
            }
          ])
        },
        dob: {
          required: true,
          inputType: 'date',
          label: "Date of Birth"
        },
        marital_status: {
          label: "Marital Status",
          inputType: 'select',
          options: [],
          getOptions: () => ([
            { id: "Single", name: "Single" },
            { id: "Married", name: "Married" }
          ])
        },
        blood_group: {
          required: true,
          inputType: 'select',
          label: "Blood Group",
          options: [],
          getOptions: () => ([
            {
              id: 'A+',
              name: 'A+'
            },
            {
              id: 'A-',
              name: 'A-'
            },
            {
              id: 'B+',
              name: 'B+'
            },
            {
              id: 'B-',
              name: 'B-'
            },
            {
              id: 'AB+',
              name: 'AB+'
            },
            {
              id: 'AB-',
              name: 'AB-'
            },
            {
              id: 'O+',
              name: 'O+'
            },
            {
              id: 'O-',
              name: 'O-'
            }
          ])
        },
        landmark: {
          required: true,
          inputType: 'text',
          label: "Landmark"
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
        permanent_address_landmark: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Landmark",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_street_address: {
          required: true,
          inputType: 'text',
          label: "Permanent Street Address",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_city: {
          required: true,
          inputType: 'text',
          label: "Permanent Address City",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_state: {
          required: true,
          inputType: 'text',
          label: "Permanent Address State",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_country: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Country",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        permanent_address_postal_code: {
          required: true,
          inputType: 'text',
          label: "Permanent Address Pincode",
          conditions: (formData) => !formData.is_permanent_address_same
        },
        is_permanent_address_same: {
          required: true,
          inputType: 'switch',
          label: "Is Permanent Address Same as Current Address",
          colSpan: 12,
          validation: z.coerce.boolean({
            required_error: "Permanent Address Same is required",
            invalid_type_error: "Permanent Address Same must be a boolean"
          })
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
        qualification: { 
          required: true, 
          inputType: 'select', 
          label: "Qualification",
          options: [],
          dependOn: null,
          getOptions: () => ([
            {
              id: "12th",
              name: "12th"
            },
            {
              id: "Graduation",
              name: "Graduation"
            },
            {
              id: "Post Graduation",
              name: "Post Graduation"
            }
          ]),
          validation: z.string({
            required_error: "Qualification is required",
            invalid_type_error: "Qualification must be a string"
          })
          .trim()
          .min(1, "Qualification must be at least 1 character long")
          .max(100, "Qualification must be at most 100 characters long")
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
    })

    ///////////////////////////////////////FORM FIELDS//////////////////////////////////////

    /////////////////////////////////////FILTER FIELDS//////////////////////////////////////

    const [joinUsRequestFilter, setJoinUsRequestFilter] = useState([
              {
                type: 'text',
                field: 'first_name',
                label: 'First Name'
              },
              {
                type: 'text',
                field: 'last_name',
                label: 'Last Name'
              },
              {
                type: 'email',
                field: 'email',
                label: 'Email'
              },
              {
                type: 'text',
                field: 'mobile',
                label: 'Mobile'
              },
              {
                type: 'select',
                field: 'status',
                label: 'Status',
                options: [
                  { value: 'ALL', label: 'All' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                  { value: 'RECEIVED', label: 'Received' },
                  { value: 'REVOKED', label: 'Revoked' },
                  { value: 'ONBOARDED', label: 'Onboarded' }
                ]
              },
              {
                type: 'date',
                field: 'startDate',
                label: 'Start Date',
                isStartDate: true
              },
              {
                type: 'date',
                field: 'endDate',
                label: 'End Date'
              }
            ])

    /////////////////////////////////////FILTER FIELDS//////////////////////////////////////
    
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
            leavePolicyFields,
            setLeavePolicyFields,
            leaveApplicationFields,
            setLeaveApplicationFields,
            reviewLeaveApplicationFields,
            setReviewLeaveApplicationFields,
            createJoinUsRequestFields,
            setCreateJoinUsRequestFields,
            joinUsRequestSubmissionFields,
            setJoinUsRequestSubmissionFields,
            negativeJoinUsRequestConfirmationFields,
            setNegativeJoinUsRequestConfirmationFields,
            employeeOnboardingFields,
            setEmployeeOnboardingFields,
            reviseEmployeeOnboardingFields,
            setReviseEmployeeOnboardingFields,
            assignTrainingFields,
            setAssignTrainingFields,
            reviseTrainingFields,
            setReviseTrainingFields,
            changeBranchFields,
            setChangeBranchFields,
            changeDepartmentFields,
            setChangeDepartmentFields,
            changeDesignationFields,
            setChangeDesignationFields,
            changeProcessFields,
            setChangeProcessFields,
            applyResignationFields,
            setApplyResignationFields,
            contactSubmissionFields,
            setContactSubmissionFields,
            careerSubmissionFields,
            setCareerSubmissionFields,
            joinUsRequestFilter,
            setJoinUsRequestFilter,
            employeeProfileFields,
            setEmployeeProfileFields,
            refreshFormUuid
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
