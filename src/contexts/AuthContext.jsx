import React, { createContext, useState, useEffect, useContext } from 'react';
import validateToken from '../services/validateToken';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState({isAuthenticated: false});
  const [permissions, setPermissions] = useState([]);
  const [permissionManagerId, setPermissionManagerId] = useState(null);
  const login = async (token) => {
    localStorage.setItem('token', token);
    await isAuthenticated();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({isAuthenticated: false});
    navigate('/login');
  }

  const getPermissions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const permissionRequest = await fetch(`${API_URL}/manager/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `${token}`,
      },
    })
    if (!permissionRequest.ok) {
      throw new Error('Failed to fetch permissions');
    }
    const permissionsData = await permissionRequest.json();
    const permissions = permissionsData?.response?.permissions;
    const permissionManagerId = permissionsData?.response?.manager_id;
    setPermissions(permissions);
    setPermissionManagerId(permissionManagerId);
  }

  const isAuthenticated = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const decoded = await validateToken();
        setAuthState({isAuthenticated: true, id : decoded?.user?.id, is_manager: decoded?.user?.is_manager });
        if (decoded?.user?.is_manager && (permissionManagerId !== decoded.id)){
          setPermissions([]);
          getPermissions();
        }
    } catch (error) {
      console.log(error);
      toast.error(error)
      return false;
    }
  };

  useEffect(() => {
    console.log('permissions')
    console.log(permissions)
  },[permissions])

  useEffect(() => {
    isAuthenticated()
  }, []);
  return (
    <AuthContext.Provider value={{ ...authState, login, logout, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
