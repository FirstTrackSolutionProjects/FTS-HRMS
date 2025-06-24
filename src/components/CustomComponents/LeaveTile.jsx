import { Box, Card, Typography } from '@mui/material';
import { useWidth } from '@/contexts/WidthContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import LeaveApplication from '../Dashboard/Leave/LeaveApplyModal';
const LeaveTile = ({ leave }) => {
  const { width } = useWidth();
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const handleToggleApplyModal = () => {
    setOpenApplyModal(prev => !prev);
  }
  const handleSubmitApplyModalEvent = () => {
    setOpenApplyModal(false);
    toast.success("Leave Applied Successfully!");
  }
  return (
    <>
    <Card
      sx={{
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*0.20,
        minWidth: 200,
        borderRadius: 4,
        paddingTop : 2,
        boxShadow: 3,
        textAlign: 'center',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.05)',
        },
      }}
      onClick={leave?.can_apply?()=>handleToggleApplyModal():null}
    > 
      {leave?.is_paid_leave && 
      <Box
        sx={{
          position: 'absolute',
          top: 5,
          right: 10,
          fontSize: Math.max(width*0.009, 9)
        }}
        className='bg-green-400 px-1 rounded-md'
      >
        Paid
      </Box>}
      <Typography sx={{ fontSize: Math.max(width*0.012, 13) }}>
        {leave?.name}
      </Typography>
      <Box sx={{ fontSize: Math.max(width*0.01, 10), color: 'primary.main' }}>{`Available Leave: ${(!leave?.is_ondemand_leave)?leave.available_leave:'On Demand'}`}</Box>
      <Box sx={{ fontSize: Math.max(width*0.01, 10), color: 'primary.main', marginBottom: 1 }}>{`Leave in process: ${(!leave?.is_ondemand_leave)?leave.leaves_in_process:'On Demand'}`}</Box>
      <Box sx={{paddingY:1, color: 'white', alignItems: 'center', justifyContent:'center', display:'flex', backgroundColor:`${leave?.can_apply?'blue':'gray'}`, width:"100%" }}>Easy Apply </Box>
    </Card>
    <LeaveApplication open={openApplyModal} onClose={handleToggleApplyModal} onSubmit={handleSubmitApplyModalEvent} leaveId={leave?.id} />
    </>
  );
};

export default LeaveTile;