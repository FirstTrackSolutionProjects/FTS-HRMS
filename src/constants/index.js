import { MdDashboardCustomize } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { TfiAnnouncement } from "react-icons/tfi";
import { GoPersonFill } from "react-icons/go";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";
import Home from "../components/Dashboard/Home/Home";
import Users from "../components/Dashboard/Users/Users";
import Announcements from "../components/Dashboard/Announcements/Announcements";
import Employees from "../components/Dashboard/Employees/Employees";
import Attendance from "../components/Dashboard/Attendance/Attendance";
import Leave from "../components/Dashboard/Leave/Leave";
import Payroll from "../components/Dashboard/Payroll/Payroll";
import Roles from "../components/Dashboard/Roles/Roles";

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
    DELETE_ROLE: 'DELETE ROLE'
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

export const sidebarNavItems = Object.freeze([
    {
        label: 'Dashboard',
        to: '/home',
        icon: MdDashboardCustomize,
        component: Home,
        permissions: []
    },
    {
        label: 'Employees',
        to: '/employees',
        icon: FaUsers,
        component: Employees,
        permissions: [PERMISSIONS.AUDIT_JOINUS]
    },
    {
        label: 'Announcements',
        to: '/announcements',
        icon: TfiAnnouncement,
        component: Announcements,
        permissions: [PERMISSIONS.AUDIT_ANNOUNCEMENT]
    },
    {
        label: 'Attendance',
        to: '/attendance',
        icon: FaRegCalendarAlt,
        component: Attendance,
        permissions: [PERMISSIONS.AUDIT_ATTENDANCE]
    },
    {
        label: 'Leaves',
        to: '/leaves',
        icon: FaPencilAlt,
        component: Leave,
        permissions: [PERMISSIONS.AUDIT_LEAVE]
    },
    {
        label: 'Payroll',
        to: '/payroll',
        icon: FaMoneyBill1Wave,
        component: Payroll,
        permissions: [PERMISSIONS.AUDIT_PAYROLL]
    },
    {
        label: 'Roles',
        to: '/roles',
        icon: RiAdminFill,
        component: Roles,
        permissions: [PERMISSIONS.AUDIT_ROLE]
    }
])