import React, { useState, useEffect } from 'react'
import ActionPopup from '@/components/CustomComponents/ActionPopup'
import CustomButton from '@/components/CustomComponents/CustomButton'
import { Box, Select, MenuItem, Typography, Paper, Divider, FormControl } from '@mui/material'
import { toast } from 'react-toastify'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import updatePayrollDateSettingsService from '@/services/updatePayrollDateSettingsService'
import getPayrollDateSettingsService from '@/services/getPayrollDateSettingsService'

const EditPayrollDate = ({ open, onClose, onSubmit }) => {
    if (!open) return null

    const [formData, setFormData] = useState({
        cycleDayOfMonth: '',
        verificationDays: ''
    })

    // Generate options for cycle days (1-28)
    const cycleDayOptions = Array.from({ length: 28 }, (_, i) => i + 1)
    
    // Generate options for verification days (1-7)
    const verificationDayOptions = Array.from({ length: 7 }, (_, i) => i + 1)

    useEffect(() => {
        if (open) {
            fetchPayrollDateSettings()
        }
    }, [open])

    const fetchPayrollDateSettings = async () => {
        try {
            const response = await getPayrollDateSettingsService()
            if (response.success) {
                setFormData({
                    cycleDayOfMonth: response.data.payroll_cycle_date,
                    verificationDays: response.data.payroll_verification_days
                })
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch payroll date settings')
        }
    }

    // Function to get ordinal suffix
    const getOrdinalSuffix = (number) => {
        const suffixes = ['th', 'st', 'nd', 'rd']
        const v = number % 100
        return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            if (!formData.cycleDayOfMonth) {
                toast.error("Please select payroll cycle day")
                return
            }

            if (!formData.verificationDays) {
                toast.error("Please select verification days")
                return
            }

            await updatePayrollDateSettingsService({
                cycle_day: Number(formData.cycleDayOfMonth),
                verification_days: Number(formData.verificationDays)
            })
            
            toast.success("Payroll cycle settings updated successfully")
            onSubmit()
        } catch (err) {
            toast.error(err.message || "Failed to update payroll settings")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Manage Payroll Cycle"
            actions={[
                <CustomButton
                    title="Update"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleSubmit}
                />
            ]}
        >
            <Box className="flex flex-col" gap={2} sx={{ p: { xs: 0.5, sm: 1 } }}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        width: '100%'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: { xs: 2, sm: 3 }
                    }}>
                        <Box>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1, 
                                mb: { xs: 1.5, sm: 2 },
                                color: 'primary.main'
                            }}>
                                <CalendarTodayIcon fontSize="small" />
                                <Typography 
                                    variant="subtitle1" 
                                    fontWeight="medium"
                                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                                >
                                    Payroll Cycle Setting
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                pl: { xs: 2, sm: 4 },
                            }}>
                                <Typography 
                                    component="span" 
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    Payroll cycle will end on
                                </Typography>
                                <FormControl 
                                    size="small"
                                    sx={{ 
                                        minWidth: 120,
                                        maxWidth: 'fit-content',
                                        bgcolor: 'background.paper',
                                        borderRadius: 1
                                    }}
                                >
                                    <Select
                                        value={formData.cycleDayOfMonth}
                                        name="cycleDayOfMonth"
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{
                                            '& .MuiSelect-select': {
                                                py: 1
                                            }
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Select day</em>
                                        </MenuItem>
                                        {cycleDayOptions.map((day) => (
                                            <MenuItem key={day} value={day}>
                                                {day}<sup>{getOrdinalSuffix(day)}</sup>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography 
                                    component="span" 
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    of every month
                                </Typography>
                            </Box>
                        </Box>

                        <Divider />

                        <Box>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1, 
                                mb: { xs: 1.5, sm: 2 },
                                color: 'primary.main'
                            }}>
                                <AccessTimeIcon fontSize="small" />
                                <Typography 
                                    variant="subtitle1" 
                                    fontWeight="medium"
                                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                                >
                                    Verification Period Setting
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                pl: { xs: 2, sm: 4 },
                            }}>
                                <Typography 
                                    component="span" 
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    After cycle ends, HR will have
                                </Typography>
                                <FormControl 
                                    size="small"
                                    sx={{ 
                                        minWidth: 120,
                                        maxWidth: 'fit-content',
                                        bgcolor: 'background.paper',
                                        borderRadius: 1
                                    }}
                                >
                                    <Select
                                        value={formData.verificationDays}
                                        name="verificationDays"
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{
                                            '& .MuiSelect-select': {
                                                py: 1
                                            }
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Select days</em>
                                        </MenuItem>
                                        {verificationDayOptions.map((day) => (
                                            <MenuItem key={day} value={day}>
                                                {day} {day === 1 ? 'day' : 'days'}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Typography 
                                    component="span" 
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                >
                                    to verify and modify payroll data
                                </Typography>
                                <Typography 
                                    component="span" 
                                    color="text.secondary"
                                    sx={{ 
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                        fontStyle: 'italic',
                                        mt: 1
                                    }}
                                >
                                    Note: After verification period ends, payroll processing will begin automatically
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </ActionPopup>
    )
}

export default EditPayrollDate