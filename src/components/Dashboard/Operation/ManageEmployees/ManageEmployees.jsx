import { manageEmployeeServices } from '@/constants'
import { useRoute } from '@/contexts/RouteContext'
import { Route, Routes } from 'react-router-dom'
import ManageEmployeeServices from './ManageEmployeeServices';

const ManageEmployees = () => {
  const { generateRoutes } = useRoute();
  return (
    <>
        <Routes>
            <Route index element={<ManageEmployeeServices />} />
            {generateRoutes(manageEmployeeServices)}
        </Routes>
    </>
  )
}

export default ManageEmployees
