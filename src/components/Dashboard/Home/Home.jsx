import AttendanceButton from '@/components/CustomComponents/AttendanceButton'
import React from 'react'
import BasicProfileBanner from './BasicProfileBanner'

const Home = () => {
  return (
    <div className='w-full h-screenm m-4 gap-2'>
      <BasicProfileBanner />
      <AttendanceButton />
    </div>
  )
}

export default Home
