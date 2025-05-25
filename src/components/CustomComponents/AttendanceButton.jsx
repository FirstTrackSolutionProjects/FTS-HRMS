import { useState, useRef, useEffect } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import CustomButton from '@/components/CustomComponents/CustomButton';
import Webcam from 'react-webcam';
import getS3PutUrlService from '@/services/getS3PutUrlService';
import s3FileUploadService from '@/services/s3FileUploadService';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import checkInService from '@/services/attendanceServices/checkInService';
import checkOutService from '@/services/attendanceServices/checkOutService';
import getEmployeeAttendanceStatusService from '@/services/attendanceServices/getEmployeeAttendanceStatusService';
import startOfficialBreakService from '@/services/attendanceServices/startOfficialBreakService';
import startPersonalBreakService from '@/services/attendanceServices/startPersonalBreakService';
import endOfficialBreakService from '@/services/attendanceServices/endOfficialBreakService';
import endPersonalBreakService from '@/services/attendanceServices/endPersonalBreakService';
import subtractTimes from '@/helpers/subtractTimes';
import getCurrentUTCTime from '@/helpers/getCurrentUTCTime';

const AttendanceButton = () => {
    const [openCamera, setOpenCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const webcamRef = useRef(null);
    const [employeeStatus, setEmployeeStatus] = useState({});    
    const [buttonText, setButtonText] = useState('CHECK IN');
    
    const { id } = useAuth()

    const getEmployeeAttendanceStatus = async () => {
        try{
            const response = await getEmployeeAttendanceStatusService();
            setEmployeeStatus(response);
        } catch (error) {
            toast.error(error?.message || 'Error fetching attendance status');
        }
    }
    useEffect(()=>{
        getEmployeeAttendanceStatus();
    },[])

    const handleAttendanceClick = async () => {
        try{
            if (!employeeStatus?.checked_in){
                setOpenCamera(true);
            } else if (!employeeStatus?.in_break && (employeeStatus?.work_time > employeeStatus?.alloted_work_time)){
                await checkOutService();
                toast.success("Checkout Successful")
                await getEmployeeAttendanceStatus();
            } else if (!employeeStatus?.in_break && employeeStatus?.is_official_break_time){
                await startOfficialBreakService();
                toast.success("Break Started Successful")
                await getEmployeeAttendanceStatus();
            } else if (!employeeStatus?.in_break && !employeeStatus?.is_official_break_time){
                await startPersonalBreakService();
                toast.success("Break Started Successful")
                await getEmployeeAttendanceStatus();
            } else if (employeeStatus?.in_break && employeeStatus?.is_official_break_time){
                await endOfficialBreakService();
                toast.success("Break Ended Successful")
                await getEmployeeAttendanceStatus();
            } else {
                endPersonalBreakService();
                toast.success("Break Ended Successful")
                await getEmployeeAttendanceStatus();
            }
        } catch(error){
            toast.error(error?.message || 'Error');
        }
    };

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
    };

    const handleReject = () => {
        setCapturedImage(null);
    };    useEffect(()=>{
        let text = 'CHECK IN';
        if (!employeeStatus?.checked_in){
            text = 'CHECK IN';
        } else if (!employeeStatus?.in_break && (employeeStatus?.work_time > employeeStatus?.alloted_work_time)){
            text = 'CHECK OUT';
        } else if (!employeeStatus?.in_break && employeeStatus?.is_official_break_time){
            text = 'START OFFICIAL BREAK';
        } else if (!employeeStatus?.in_break && !employeeStatus?.is_official_break_time){
            text = 'START PERSONAL BREAK';
        } else if (employeeStatus?.in_break && employeeStatus?.is_official_break_time){
            text = 'END OFFICIAL BREAK';
        } else {
            text = 'END PERSONAL BREAK';
        }
        setButtonText(text);
    },[employeeStatus])

    const handleAccept = async () => {
        try {
            // Convert base64 to blob
            const base64Data = capturedImage.split(',')[1];
            const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
            
            const timestamp = new Date().toISOString();
            const key = `attendance/${timestamp}_${id}_attendance.jpg`;
            
            // Get S3 upload URL
            const uploadUrl = await getS3PutUrlService(key, 'image/jpeg');
            
            // Upload to S3
            await s3FileUploadService(uploadUrl, blob, 'image/jpeg');

            await checkInService(key);
            await getEmployeeAttendanceStatusService();
            toast.success('Attendance marked successfully!');
            setOpenCamera(false);
            setCapturedImage(null);
        } catch (error) {
            toast.error(error?.message || 'Failed to mark attendance');
            console.error(error);
        }
    };

    const handleClose = () => {
        setOpenCamera(false);
        setCapturedImage(null);
    };

    return (
        <>
            {employeeStatus?.checked_in && 
            <Box>
               Remaining Official Break Time :  {employeeStatus?.remaining_official_break_time}<br />
               Remaining Personal Break Time :  {employeeStatus?.remaining_personal_break_time}<br />
               Target Work Time: {employeeStatus?.alloted_work_time}<br />
               Achieved Work Time: {subtractTimes(getCurrentUTCTime(), employeeStatus?.check_in_time)}<br />
            </Box>}
            <CustomButton
                title={buttonText}
                onClick={handleAttendanceClick}
                disabled={!employeeStatus?.is_shift_started}
            />

            <Modal
                open={openCamera}
                onClose={handleClose}
                aria-labelledby="camera-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{
                    backgroundColor: 'white',
                    padding: 3,
                    borderRadius: 2,
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                    <Typography variant="h6" component="h2">
                        Mark Attendance
                    </Typography>

                    {!capturedImage ? (
                        <>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                    width: 480,
                                    height: 360,
                                    facingMode: "user"
                                }}
                            />
                            <CustomButton
                                title="Capture"
                                onClick={handleCapture}
                            />
                        </>
                    ) : (
                        <>
                            <img
                                src={capturedImage}
                                alt="captured"
                                style={{
                                    width: '480px',
                                    height: '360px',
                                    objectFit: 'cover'
                                }}
                            />
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                justifyContent: 'center'
                            }}>
                                <CustomButton
                                    title="Accept"
                                    onClick={handleAccept}
                                    sx={{ backgroundColor: '#4CAF50' }}
                                />
                                <CustomButton
                                    title="Reject"
                                    onClick={handleReject}
                                    sx={{ backgroundColor: '#f44336' }}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default AttendanceButton;
