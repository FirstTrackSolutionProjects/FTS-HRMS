import React, { createContext, useState, useEffect, useContext } from 'react';
import validateTokenService from '@/services/validateTokenService';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import getEmployeePermissionsService from '@/services/getEmployeePermissionsService';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [authState, setAuthState] = useState({isAuthenticated: false});
  const [permissions, setPermissions] = useState([]);
  const [permissionEmployeeId, setPermissionEmployeeId] = useState(null);
  const login = async (token) => {
    localStorage.setItem('token', token);
    await isAuthenticated();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({isAuthenticated: false});
    navigate('/sign-in');
  }

  const getPermissions = async () => {
    setPermissions([]);
    setPermissionEmployeeId(null);
    const token = localStorage.getItem('token');
    if (!token) return;
    try{
      const permissionsData = await getEmployeePermissionsService()
      const permissions = permissionsData?.permissions;
      const permissionEmployeeId = permissionsData?.employee_id;
      setPermissions(permissions);
      setPermissionEmployeeId(permissionEmployeeId);
    } catch (err){
      console.error(err)
    }
  }

  const checkPermission = (permission) => {
    if (authState.is_superadmin) return true;
    return permissions.includes(permission);
  }

  const isAuthenticated = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const user = await validateTokenService();
        setAuthState({isAuthenticated: true, id : user?.id, is_superadmin: user?.is_superadmin });
        getPermissions();
    } catch (error) {
      location.pathname.includes('/dashboard')?navigate('/sign-in'):null;
      console.log(error);
      toast.error(error)
      return false;
    }
  };

  useEffect(() => {
    console.log('permissions')
    console.log(permissions)
    console.log(authState)
  },[permissions])

  useEffect(() => {
    isAuthenticated()
  }, []);
  return (
    <AuthContext.Provider value={{ ...authState, login, logout, permissions, checkPermission, getPermissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
