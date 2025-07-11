import { submissionServices } from '@/constants'
import { useRoute } from '@/contexts/RouteContext'
import { Route, Routes } from 'react-router-dom'
import SubmissionServices from './SubmissionServices';


const Submissions = () => {
  const { generateRoutes } = useRoute();
  return (
    <>
        <Routes>
            <Route index element={<SubmissionServices />} />
            {generateRoutes(submissionServices)}
        </Routes>
    </>
  )
}

export default Submissions
