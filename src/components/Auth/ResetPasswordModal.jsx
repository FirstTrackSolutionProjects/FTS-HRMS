import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomForm from '@/components/CustomComponents/CustomForm';
import CustomButton from '@/components/CustomComponents/CustomButton';
import sendResetPasswordOtpService from '@/services/passwordServices/sendResetPasswordOtpService';
import verifyResetPasswordOtpService from '@/services/passwordServices/verifyResetPasswordOtpService';
import { toast } from 'react-toastify';

/*
  ResetPasswordModal Flow:
  Step 1: Ask for email -> send OTP
  Step 2: Ask for otp, newPassword, confirmPassword -> verify & reset
  Uses existing CustomForm for consistency.
*/

const ResetPasswordModal = ({ open, onClose }) => {
  const formRef = useRef();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Dynamic fields based on step
  const [fieldsStep1, setFieldsStep1] = useState({
    email: { label: 'Email', inputType: 'text', required: true, placeholder: 'john@example.com', colSpan:12 }
  });

  const [fieldsStep2, setFieldsStep2] = useState({
    otp: { label: 'OTP', inputType: 'text', required: true, placeholder: 'Enter OTP', colSpan: 12 },
    newPassword: { label: 'New Password', inputType: 'text', type: 'password', required: true, placeholder: '********', colSpan: 12 },
    confirmPassword: { label: 'Confirm Password', inputType: 'text', type: 'password', required: true, placeholder: '********', colSpan: 12 },
  });

  const handleSendOtp = async () => {
    if (!formRef.current) return;
    setLoading(true);
    const data = formRef.current.formData;
    setLoading(true);
    try {
      await sendResetPasswordOtpService(data);
      toast.success('OTP sent to email');
      setEmail(data.email);
      setStep(2);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!formRef.current) return;
    setLoading(true);
    const { otp, newPassword, confirmPassword } = formRef.current.formData;
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await verifyResetPasswordOtpService({ email, otp, newPassword });
      toast.success('Password reset successfully');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      return;
    }
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setStep(1);
      setEmail('');
    }
  }, [open]);

  const activeFields = step === 1 ? fieldsStep1 : fieldsStep2;

  const actionFunc = step === 1 ? handleSendOtp : handleVerify;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={600}>{step === 1 ? 'Reset Password' : 'Verify OTP & Set Password'}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <CustomForm
          ref={formRef}
          fields={activeFields}
          setFields={() => {}}
          handleSubmit={actionFunc}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <CustomButton
          secondary
          title={step === 1 ? 'Close' : 'Back'}
          onClick={handleBack}
          disabled={loading}
        />
        {step === 1 ? (
          <CustomButton
            title={loading ? 'Sending...' : 'Send OTP'}
            onClick={()=>formRef?.current?.submitForm()}
            disabled={loading}
            color="primary"
          />
        ) : (
          <CustomButton
            title={loading ? 'Verifying...' : 'Reset Password'}
            onClick={()=>formRef?.current?.submitForm()}
            disabled={loading}
            color="primary"
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordModal;
