import { Box } from '@mui/material'
import LeaveTile from './LeaveTile'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import getActiveNonSpecialLeaveService from '@/services/leaveServices/leaveTrackingServices/getActiveNonSpecialLeaveService';

const LeaveTiles = () => {
    const [leaves , setLeaves] = useState([]);
    const getActiveNonSpecialLeaves = async () => {
        try{
            const leaves = await getActiveNonSpecialLeaveService();
            setLeaves(leaves);
        } catch (error){
            console.log(error);
            toast.error(error?.message || 'Error fetching leaves');
        }
    }
    useEffect(()=>{
        getActiveNonSpecialLeaves();
    },[])
  return (
    <Box padding={4} display={'flex'} gap={2} flexWrap={'wrap'} justifyContent={'center'}>
      {leaves.map((leave, index)=>(
        <LeaveTile key={index} leave={leave} index={index} />
      ))}
    </Box>
  )
}

export default LeaveTiles
