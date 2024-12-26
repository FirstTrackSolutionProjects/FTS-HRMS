export const PERMISSIONS = Object.freeze({
    CREATE_MANAGER: 'CREATE_MANAGER',
    UPDATE_MANAGER: 'UPDATE_MANAGER',
    DELETE_MANAGER: 'DELETE_MANAGER',
    AUDIT_MANAGER: 'AUDIT_MANAGER',
    CREATE_ANNOUNCEMENT: 'CREATE_ANNOUNCEMENT',
    UPDATE_ANNOUNCEMENT: 'UPDATE_ANNOUNCEMENT',
    DELETE_ANNOUNCEMENT: 'DELETE_ANNOUNCEMENT',
    AUDIT_ANNOUNCEMENT: 'AUDIT_ANNOUNCEMENT',
    CREATE_EMPLOYEE: 'CREATE_EMPLOYEE',
    UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
    DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
    AUDIT_EMPLOYEE: 'AUDIT_EMPLOYEE',
    UPDATE_ATTENDANCE: 'UPDATE_ATTENDANCE',
    AUDIT_ATTENDANCE: 'AUDIT_ATTENDANCE',
    UPDATE_LEAVE: 'UPDATE_LEAVE',
    AUDIT_LEAVE: 'AUDIT_LEAVE',
    CREATE_PAYROLL: 'CREATE_PAYROLL',
    UPDATE_PAYROLL: 'UPDATE_PAYROLL',
    DELETE_PAYROLL: 'DELETE_PAYROLL',
    AUDIT_PAYROLL: 'AUDIT_PAYROLL'
});

export const ROLES = Object.freeze({
    CEO: {
        ACRONYM : 'CEO',
        TITLE : 'Chief Executive Officer'
    },
    HR: {
        ACRONYM : 'HR',
        TITLE : 'Human Resources Manager'
    }
})

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