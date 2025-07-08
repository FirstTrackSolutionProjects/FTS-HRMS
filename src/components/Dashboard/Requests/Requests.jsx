import { requestsServices } from '@/constants'
import { useRoute } from '@/contexts/RouteContext'
import { Route, Routes } from 'react-router-dom'
import RequestsServices from './RequestsServices';

const Requests = () => {
  const { generateRoutes } = useRoute();
  return (
    <>
        <Routes>
            <Route index element={<RequestsServices />} />
            {generateRoutes(requestsServices)}
        </Routes>
    </>
  )
}

export default Requests
