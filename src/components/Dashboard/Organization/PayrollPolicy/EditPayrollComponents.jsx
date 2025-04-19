import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useState } from "react"
import ActionPopup from "../../../CustomComponents/ActionPopup"
import { Box, FormControl, MenuItem, Select, TextField, IconButton, Switch, FormControlLabel, Typography } from "@mui/material"
import DeleteIcon from "@/icons/DeleteIcon"
import AddIcon from "@mui/icons-material/Add"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import updatePayrollComponentPolicyService from "@/services/updatePayrollComponentPolicyService"

const EditPayrollComponents = ({ open, onClose, onSubmit, payrollComponentData }) => {
    if (!open) return;

    const [formData, setFormData] = useState(payrollComponentData.map(comp => ({
        ...comp,
        is_basic_salary: comp.is_basic_salary || false
    })))
    const [errors, setErrors] = useState([])

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(formData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFormData(items);
    };

    const validateForm = () => {
        const newErrors = []
        
        // Check if there are any components
        if (formData.length === 0) {
            toast.error("Please add at least one payroll component")
            return false
        }

        // Check if there is at least one basic salary component
        if (!formData.some(comp => comp.is_basic_salary)) {
            toast.error("Please select at least one component as basic salary")
            return false
        }

        // Check if basic salary is Fixed type
        const basicSalaryComponent = formData.find(comp => comp.is_basic_salary)
        if (basicSalaryComponent && basicSalaryComponent.type !== 'Fixed') {
            toast.error("Basic salary component must be of Fixed type")
            return false
        }

        // Validate each component
        formData.forEach((component, index) => {
            if (!component.name.trim()) {
                newErrors[index] = { ...newErrors[index], name: "Component name is required" }
            }
            if (!component.type) {
                newErrors[index] = { ...newErrors[index], type: "Component type is required" }
            }
        })

        setErrors(newErrors)
        return newErrors.length === 0
    }

    const handleSubmit = async () => {
        try {
            if (!validateForm()) {
                return
            }

            // Check for duplicate component names
            const names = formData.map(comp => comp.name.trim().toLowerCase())
            const hasDuplicates = names.some((name, index) => names.indexOf(name) !== index)
            if (hasDuplicates) {
                toast.error("Duplicate component names are not allowed")
                return
            }

            await updatePayrollComponentPolicyService(formData)
            toast.success("Payroll component policy updated successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to update payroll components")
        }
    }

    const handleAddComponent = () => {
        setFormData([...formData, {
            id: Date.now(),
            name: '',
            type: 'Fixed',
            is_basic_salary: false
        }])
    }

    const handleDeleteComponent = (id) => {
        const componentToDelete = formData.find(item => item.id === id)
        
        if (componentToDelete.is_basic_salary) {
            toast.warning("Please select another component as basic salary before deleting this one")
            return
        }

        if (formData.length === 1) {
            toast.warning("At least one component is required")
            return
        }
        setFormData(formData.filter(item => item.id !== id))
    }

    const handleComponentChange = (id, field, value) => {
        if (field === 'is_basic_salary') {
            const component = formData.find(item => item.id === id)
            
            // Check if the component is not Fixed type
            if (component.type !== 'Fixed') {
                toast.warning("Only Fixed type components can be marked as basic salary")
                return
            }

            // If turning off basic salary, check if it's the only one
            if (component.is_basic_salary && !value && !formData.some(item => item.id !== id && item.is_basic_salary)) {
                toast.warning("At least one component must be marked as basic salary")
                return
            }

            // If turning on basic salary, turn off others
            setFormData(formData.map(item => ({
                ...item,
                is_basic_salary: item.id === id ? value : value ? false : item.is_basic_salary
            })))
            return
        }

        if (field === 'type') {
            const component = formData.find(item => item.id === id)
            
            // If changing type of basic salary component
            if (component.is_basic_salary && value !== 'Fixed') {
                toast.warning("Basic salary component must be of Fixed type")
                return
            }

            // If changing to non-Fixed type, remove basic salary flag
            if (value !== 'Fixed' && component.is_basic_salary) {
                toast.warning("Changing type will remove basic salary status")
                setFormData(formData.map(item => {
                    if (item.id === id) {
                        return { ...item, type: value, is_basic_salary: false }
                    }
                    return item
                }))
                return
            }
        }

        setFormData(formData.map(item => {
            if (item.id === id) {
                // Clear error when user starts typing
                const index = formData.findIndex(comp => comp.id === id)
                const newErrors = [...errors]
                if (newErrors[index]) {
                    delete newErrors[index][field]
                }
                setErrors(newErrors)
                return { ...item, [field]: value }
            }
            return item
        }))
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Update Components"
            actions={[
                <CustomButton
                    title="Update"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleSubmit}
                    disabled={formData.length === 0}
                />
            ]}
        >
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="payroll-components">
                    {(provided) => (
                        <Box 
                            className={"flex flex-col items-center"} 
                            gap={2}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {formData.map((data, index) => (
                                <Draggable 
                                    key={data.id.toString()} 
                                    draggableId={data.id.toString()} 
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <Box 
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="flex w-full items-center" 
                                            gap={1}
                                            sx={{
                                                background: snapshot.isDragging ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                                                borderRadius: '4px',
                                                padding: '4px',
                                                width: '100%'
                                            }}
                                        >
                                            <Box {...provided.dragHandleProps} sx={{ cursor: 'grab', color: 'gray' }}>
                                                <DragIndicatorIcon />
                                            </Box>
                                            <TextField
                                                label="Component Name"
                                                name="name"
                                                value={data.name}
                                                onChange={(e) => handleComponentChange(data.id, 'name', e.target.value)}
                                                size="small"
                                                fullWidth
                                                error={Boolean(errors[index]?.name)}
                                                helperText={errors[index]?.name}
                                                required
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontWeight: data.is_basic_salary ? 'bold' : 'normal'
                                                    }
                                                }}
                                            />
                                            <FormControl fullWidth size="small" error={Boolean(errors[index]?.type)}>
                                                <Select
                                                    name={'type'}
                                                    value={data.type}
                                                    onChange={(e) => handleComponentChange(data.id, 'type', e.target.value)}
                                                    fullWidth
                                                    required
                                                    sx={{
                                                        fontWeight: data.is_basic_salary ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    <MenuItem value={'Fixed'}>{'Fixed'}</MenuItem>
                                                    <MenuItem value={'Variable'}>{'Variable'}</MenuItem>
                                                    <MenuItem value={'Benefits'}>{'Benefits'}</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={data.is_basic_salary}
                                                        onChange={(e) => handleComponentChange(data.id, 'is_basic_salary', e.target.checked)}
                                                        color="primary"
                                                        disabled={data.type !== 'Fixed'}
                                                    />
                                                }
                                                label={
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            fontWeight: data.is_basic_salary ? 'bold' : 'normal'
                                                        }}
                                                    >
                                                        Basic
                                                    </Typography>
                                                }
                                            />
                                            <DeleteIcon onClick={() => handleDeleteComponent(data.id)} className={"w-16"} />
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            <IconButton 
                                color="primary" 
                                onClick={handleAddComponent}
                                sx={{ alignSelf: 'flex-start' }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
        </ActionPopup>
    )
}

export default EditPayrollComponents
