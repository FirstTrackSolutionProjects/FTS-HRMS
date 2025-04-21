import { operationServices } from '@/constants'
import { useRoute } from '@/contexts/RouteContext'
import { Route, Routes } from 'react-router-dom'
import OperationServices from '@/components/Dashboard/Operation/OperationServices';

const Operation = () => {
  const { generateRoutes } = useRoute();
  return (
    <>
        <Routes>
            <Route index element={<OperationServices />} />
            {generateRoutes(operationServices)}
        </Routes>
    </>
  )
}

export default Operation
