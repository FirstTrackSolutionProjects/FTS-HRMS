import { MdDashboardCustomize } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
import { GoPersonFill } from "react-icons/go";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";
import ManagerDashboardHome from "../components/ManagerDashboard/ManagerDashboardHome/ManagerDashboardHome";
import ManagerDashboardUsers from "../components/ManagerDashboard/ManagerDashboardUsers/ManagerDashboardUsers";
import ManagerDashboardAnnouncements from "../components/ManagerDashboard/ManagerDashboardAnnouncements/ManagerDashboardAnnouncements";
import ManagerDashboardEmployees from "../components/ManagerDashboard/ManagerDashboardEmployees/ManagerDashboardEmployees";
import ManagerDashboardAttendance from "../components/ManagerDashboard/ManagerDashboardAttendance/ManagerDashboardAttendance";
import ManagerDashboardLeave from "../components/ManagerDashboard/ManagerDashboardLeave/ManagerDashboardLeave";
import ManagerDashboardPayroll from "../components/ManagerDashboard/ManagerDashboardPayroll/ManagerDashboardPayroll";
import ManagerDashboardRoles from "../components/ManagerDashboard/ManagerDashboardRoles/ManagerDashboardRoles";

export const PERMISSIONS = Object.freeze({
    CREATE_MANAGER: 'CREATE_MANAGER',
    UPDATE_MANAGER: 'UPDATE_MANAGER',
    AUDIT_MANAGER: 'AUDIT_MANAGER',
    CREATE_ANNOUNCEMENT: 'CREATE_ANNOUNCEMENT',
    UPDATE_ANNOUNCEMENT: 'UPDATE_ANNOUNCEMENT',
    DELETE_ANNOUNCEMENT: 'DELETE_ANNOUNCEMENT',
    AUDIT_ANNOUNCEMENT: 'AUDIT_ANNOUNCEMENT',
    CREATE_EMPLOYEE: 'CREATE_EMPLOYEE',
    UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
    AUDIT_EMPLOYEE: 'AUDIT_EMPLOYEE',
    UPDATE_ATTENDANCE: 'UPDATE_ATTENDANCE',
    AUDIT_ATTENDANCE: 'AUDIT_ATTENDANCE',
    UPDATE_LEAVE: 'UPDATE_LEAVE',
    AUDIT_LEAVE: 'AUDIT_LEAVE',
    CREATE_PAYROLL: 'CREATE_PAYROLL',
    UPDATE_PAYROLL: 'UPDATE_PAYROLL',
    AUDIT_PAYROLL: 'AUDIT_PAYROLL',
    CREATE_ROLE: 'CREATE_ROLE',
    UPDATE_ROLE: 'UPDATE_ROLE',
    DELETE_ROLE: 'DELETE_ROLE',
    AUDIT_ROLE: 'AUDIT_ROLE'
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

export const adminSidebarNavItems = Object.freeze([
    {
        label: 'Dashboard',
        to: '/home',
        icon: MdDashboardCustomize,
        component: ManagerDashboardHome,
        permissions: []
    },
    {
        label: 'Users',
        to: '/users',
        icon: FaUsers,
        component: ManagerDashboardUsers,
        permissions: ['AUDIT_MANAGER']
    },
    {
        label: 'Announcements',
        to: '/announcements',
        icon: TfiAnnouncement,
        component: ManagerDashboardAnnouncements,
        permissions: ['AUDIT_ANNOUNCEMENT']
    },
    {
        label: 'Employees',
        to: '/employees',
        icon: GoPersonFill,
        component: ManagerDashboardEmployees,
        permissions: ['AUDIT_EMPLOYEE']
    },
    {
        label: 'Attendance',
        to: '/attendance',
        icon: FaRegCalendarAlt,
        component: ManagerDashboardAttendance,
        permissions: ['AUDIT_ATTENDANCE']
    },
    {
        label: 'Leaves',
        to: '/leaves',
        icon: FaPencilAlt,
        component: ManagerDashboardLeave,
        permissions: ['AUDIT_LEAVE']
    },
    {
        label: 'Payroll',
        to: '/payroll',
        icon: FaMoneyBill1Wave,
        component: ManagerDashboardPayroll,
        permissions: ['AUDIT_PAYROLL']
    },
    {
        label: 'Roles',
        to: '/roles',
        icon: RiAdminFill,
        component: ManagerDashboardRoles,
        permissions: ['AUDIT_ROLE']
    }
])