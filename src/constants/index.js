import { MdDashboardCustomize } from "react-icons/md";
import { FaBriefcase, FaClock, FaEnvelope, FaFile, FaFileAlt, FaHome, FaUserMinus, FaUserPlus, FaUsers } from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
import { GoPersonFill } from "react-icons/go";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";
import Home from "@/components/Dashboard/Home/Home";
import Announcements from "@/components/Dashboard/Announcements/Announcements";
import Attendance from "@/components/Dashboard/Attendance/Attendance";
import Leave from "@/components/Dashboard/Leave/Leave";
import Payroll from "@/components/Dashboard/Payroll/Payroll";
import ManageRoles from "@/components/Dashboard/Organization/ManageRoles/ManageRoles";
import Organization from "@/components/Dashboard/Organization/Organization";
import ManageBranch from "@/components/Dashboard/Organization/ManageBranch/ManageBranch";
import ManageDepartment from "@/components/Dashboard/Organization/ManageDepartment/ManageDepartment";
import Operation from "@/components/Dashboard/Operation/Operation";
import PayrollPolicy from "@/components/Dashboard/Organization/PayrollPolicy/PayrollPolicy";
import ManageShifts from "@/components/Dashboard/Organization/ManageShifts/ManageShifts";
import EmployeeScheduling from "@/components/Dashboard/Operation/EmployeeScheduling/EmployeeScheduling";
import ManageAttendance from "@/components/Dashboard/Operation/ManageAttendance/ManageAttendance";
import LeavePolicy from "@/components/Dashboard/Organization/LeavePolicy/LeavePolicy";
import LeaveManagement from "@/components/Dashboard/Operation/LeaveManagement/LeaveManagement";
import ManageEmployees from "@/components/Dashboard/Operation/ManageEmployees/ManageEmployees";
import Employees from "@/components/Dashboard/Operation/ManageEmployees/ViewEmployees/Employees";
import EmployeeOnboarding from "@/components/Dashboard/Operation/ManageEmployees/EmployeeOnboarding/EmployeeOnboarding";
import Requests from "@/components/Dashboard/Requests/Requests";
import RequestResignation from "@/components/Dashboard/Requests/RequestResignation/RequestResignation";
import ManagePayrolls from "@/components/Dashboard/Operation/ManagePayrolls/ManagePayrolls";
import ExitManagement from "@/components/Dashboard/Operation/ExitManagement/ExitManagement";
import ResignationRequests from "@/components/Dashboard/Operation/ExitManagement/ResignationRequests/ResignationRequests";
import Submissions from "@/components/Dashboard/Operation/Submissions/Submissions";
import ContactSubmissions from "@/components/Dashboard/Operation/Submissions/ContactSubmissions/ContactSubmissions";
import CareerSubmissions from "@/components/Dashboard/Operation/Submissions/CareerSubmissions/CareerSubmissions";

export const PERMISSIONS = Object.freeze({
    AUDIT_JOINUS: 'AUDIT JOINUS',
    MANAGE_JOINUS: 'MANAGE JOINUS',
    AUDIT_PAYROLL: 'AUDIT PAYROLL',
    MANAGE_PAYROLL: 'MANAGE PAYROLL',
    CREATE_ANNOUNCEMENT: 'CREATE ANNOUNCEMENT',
    UPDATE_ANNOUNCEMENT: 'UPDATE ANNOUNCEMENT',
    DELETE_ANNOUNCEMENT: 'DELETE ANNOUNCEMENT',
    AUDIT_ANNOUNCEMENT: 'AUDIT ANNOUNCEMENT',
    AUDIT_ATTENDANCE: 'AUDIT ATTENDANCE',
    MANAGE_ATTENDANCE: 'MANAGE ATTENDANCE',
    AUDIT_LEAVE: 'AUDIT LEAVE',
    AUDIT_ROLE: 'AUDIT ROLE',
    UPDATE_ROLE: 'UPDATE ROLE',
    CREATE_ROLE: 'CREATE ROLE',
    DELETE_ROLE: 'DELETE ROLE',
    MANAGE_ORGANIZATION: 'MANAGE ORGANIZATION',
    UPDATE_DEPARTMENT: 'UPDATE DEPARTMENT',
    UPDATE_DESIGNATION: 'UPDATE DESIGNATION'
});

export const headerNavItems = Object.freeze([
    {
        label: 'Home',
        to: '/',
    },
    {
        label: 'About Us',
        to: '/about-us'
    },
    {
        label: 'Contact Us',
        to: '/contact-us'
    }
])

export const personalBreaks = Object.freeze([
    "EMERGENCY BREAK",
    "REFRESHNESS",
    "TEA"
])

export const joinUsRequestStatuses = Object.freeze({
    PENDING: "PENDING",
    RECEIVED: "RECEIVED",
})

export const sidebarNavItems = Object.freeze([
    {
        label: 'Dashboard',
        to: '/home',
        icon: MdDashboardCustomize,
        component: Home,
        permissions: []
    },
    {
        label: 'Announcements',
        to: '/announcements',
        icon: TfiAnnouncement,
        component: Announcements,
        permissions: []
    },
    {
        label: 'Attendance',
        to: '/attendance',
        icon: FaRegCalendarAlt,
        component: Attendance,
        permissions: []
    },
    {
        label: 'Leaves',
        to: '/leaves',
        icon: FaPencilAlt,
        component: Leave,
        permissions: []
    },
    {
        label: 'Payroll',
        to: '/payroll',
        icon: FaMoneyBill1Wave,
        component: Payroll,
        permissions: []
    },
    {
        label: 'Requests',
        to: '/requests/*',
        icon: FaFile,
        component: Requests,
        permissions: []
    },
    {
        label: 'Operation',
        to: '/operation/*',
        icon: GoPersonFill,
        component: Operation,
        permissions: [PERMISSIONS.AUDIT_JOINUS]
    },
    {
        label: 'Organization',
        to: '/organization/*',
        icon: FaHome,
        component: Organization,
        permissions: [PERMISSIONS.MANAGE_ORGANIZATION]
    }
])

export const organizationServices = [
    {
        title: 'Branch Manage',
        to: 'branch',
        description: 'Manage branches of organization',
        icon: FaHome,
        component: ManageBranch
    },
    {
        title: 'Department Manage',
        to: 'department',
        description: 'Manage departments of organization',
        icon: FaHome,
        component: ManageDepartment
    },
    {
        title: 'Role Manage',
        to: 'role',
        description: 'Manage roles of organization',
        icon: RiAdminFill,
        component: ManageRoles
    },
    {
        title: 'Payroll Policy',
        to: 'payroll-policy',
        description: 'Payroll Management System',
        icon: FaMoneyBill1Wave,
        component: PayrollPolicy
    },
    {
        title: 'Leave Policy',
        description: 'Leave Management System',
        to: 'leave-policy',
        icon: FaPencilAlt,
        component: LeavePolicy
    },
    {
        title: 'Attendance Policy',
        description: 'Attendance Management System',
        icon: FaRegCalendarAlt
    },
    {
        title: 'Shift Manage',
        description: 'Manage shifts of employees',
        to: 'shifts',
        icon: FaClock,
        component: ManageShifts
    }
]

export const operationServices = [
    {
        title: 'Employees',
        description: 'Manage Employees',
        to: 'employees/*',
        icon: FaUsers,
        component: ManageEmployees
    },
    {
        title: 'Payroll',
        description: 'Payroll Management System',
        to: 'payroll',
        icon: FaMoneyBill1Wave,
        component: ManagePayrolls
    },
    {
        title: 'Leave Management',
        description: 'Leave Management System',
        to: 'leave-management',
        icon: FaPencilAlt,
        component: LeaveManagement
    },
    {
        title: 'Attendance',
        description: 'Attendance Management System',
        to: 'attendance',
        icon: FaRegCalendarAlt,
        component: ManageAttendance
    },
    {
        title: 'Exit Management',
        description: 'Exit Management System',
        to: 'exit-management/*',
        icon: FaUserMinus,
        component: ExitManagement
    },
    {
        title: 'Submissions',
        description: 'Manage Submissions',
        to: 'submissions/*',
        icon: FaFileAlt,
        component: Submissions
    }
]

export const manageEmployeeServices = [
    {
        title: 'View Employees',
        description: 'View all employees',
        to: 'view-employees',
        icon: FaUsers,
        component: Employees
    },
    {
        title: 'Employee Onboarding',
        description: 'Employee Onboarding Process',
        to: 'employee-onboarding',
        icon: FaUserPlus,
        component: EmployeeOnboarding
    },
    {
        title: 'Employee Scheduling',
        description: 'Employee Scheduling System',
        to: 'scheduling',
        icon: FaClock,
        component: EmployeeScheduling
    }
]

export const requestsServices = [
    {
        title: 'Request Resignation',
        to: 'resignation-requests',
        icon: FaUserMinus,
        component: RequestResignation
    }
]

export const exitManagementServices = [
    {
        title: 'Resignation Requests',
        to: 'resignation-requests',
        icon: FaUserMinus,
        component: ResignationRequests
    }
]

export const submissionServices = [
    {
        title: 'Contact Submissions',
        to: 'contact-submissions',
        icon: FaEnvelope,
        component: ContactSubmissions
    },
    {
        title: 'Career Submissions',
        to: 'career-submissions',
        icon: FaBriefcase,
        component: CareerSubmissions
    }
]