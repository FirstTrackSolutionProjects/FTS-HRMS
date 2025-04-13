import { organizationServices } from '@/constants'
import { useRoute } from '@/contexts/RouteContext'
import { Route, Routes } from 'react-router-dom'
import OrganizationServices from '@/components/Dashboard/Organization/OrganizationServices';

const Organization = () => {
  const { generateRoutes } = useRoute();
  return (
    <>
        <Routes>
            <Route index element={<OrganizationServices />} />
            {generateRoutes(organizationServices)}
        </Routes>
    </>
  )
}

export default Organization
