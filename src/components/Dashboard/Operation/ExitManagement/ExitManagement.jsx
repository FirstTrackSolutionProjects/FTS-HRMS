import { exitManagementServices } from '@/constants'
import { useRoute } from '@/contexts/RouteContext'
import { Route, Routes } from 'react-router-dom'
import ExitManagementServices from './ExitManagementServices';

const ExitManagement = () => {
  const { generateRoutes } = useRoute();
  return (
    <>
        <Routes>
            <Route index element={<ExitManagementServices />} />
            {generateRoutes(exitManagementServices)}
        </Routes>
    </>
  )
}

export default ExitManagement
