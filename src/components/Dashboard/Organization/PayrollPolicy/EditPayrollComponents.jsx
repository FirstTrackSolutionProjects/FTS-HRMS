import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import ActionPopup from "../../../CustomComponents/ActionPopup"
import {
  Box, FormControl, MenuItem, Select, TextField, IconButton,
  Switch, FormControlLabel, InputAdornment
} from "@mui/material"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import updatePayrollComponentPolicyService from "@/services/updatePayrollComponentPolicyService"

const CATEGORY_OPTIONS = [
  { value: "GROSS", label: "Gross Salary" },
  { value: "EMPLOYEE DEDUCTIONS", label: "Employee Deductions" },
  { value: "EMPLOYER CONTRIBUTIONS", label: "Employer Contributions" },
]

const CALC_TYPES = [
  { value: "MANUAL", label: "Manual" },
  { value: "BASIC %", label: "Percent of Basic" },
  { value: "GROSS %", label: "Percent of Gross" },
  { value: "COMPONENT %", label: "Percent of Another Component" },
]

const EditPayrollComponents = ({ open, onClose, onSubmit, payrollComponentData, allComponents }) => {
  if (!open) return null

  const [formData, setFormData] = useState([])

  useEffect(() => {
    const transformed = payrollComponentData.map((c, index) => ({
      ...c,
      order: index,
      calculation_type: c.calculation_type || "MANUAL",
      percentage: c.percentage?.toString() || "",
      cap_amount: c.cap_amount?.toString() || "",
      is_active: c.is_active !== false // default to true
    }))
    setFormData(transformed)
  }, [payrollComponentData])

  const handleChange = (id, field, value) => {
    setFormData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const onDragEnd = result => {
    if (!result.destination) return
    const items = [...formData]
    const [removed] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, removed)
    // Reassign order values
    const reordered = items.map((item, index) => ({ ...item, order: index }))
    setFormData(reordered)
  }


  const handleSubmit = async () => {
    try {
      await updatePayrollComponentPolicyService(formData)
      toast.success("Payroll components updated")
      onSubmit()
    } catch (err) {
      toast.error(err.message || "Error saving components")
    }
  }

  return (
    <ActionPopup
      open={open}
      onClose={onClose}
      title="Edit Payroll Components"
      actions={[<CustomButton key="update" title="Update" variant="contained" onClick={handleSubmit} />]}
    >
        <Box display="flex" justifyContent="flex-end">
  <CustomButton
    title="Add Component"
    variant="outlined"
    onClick={() => {
      const newId = Date.now(); // Or use a UUID generator if needed
      setFormData(prev => [
        ...prev,
        {
          id: newId,
          name: "",
          category: "GROSS",
          calculation_type: "MANUAL",
          percentage: "",
          cap_amount: "",
          target_component_id: "",
          is_active: true,
          is_basic_salary: false,
        }
      ])
    }}
  />
</Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="component-list">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps} display="flex" flexDirection="column" gap={2}>
              {formData.map((item, index) => (
                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      display="flex" alignItems="center" gap={1}
                      sx={{ flexWrap: 'wrap' }}
                    >
                      <Box {...provided.dragHandleProps}><DragIndicatorIcon /></Box>

                      <TextField
                        label="Name"
                        size="small"
                        value={item.name}
                        onChange={e => handleChange(item.id, "name", e.target.value)}
                        sx={{ minWidth: 150 }}
                      />

                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={item.category}
                          onChange={e => handleChange(item.id, "category", e.target.value)}
                        >
                          {CATEGORY_OPTIONS.map(o => (
                            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={item.calculation_type}
                          onChange={e => handleChange(item.id, "calculation_type", e.target.value)}
                        >
                          {CALC_TYPES.map(c => (
                            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {(item.calculation_type !== "MANUAL") && (
                        <TextField
                          label="%"
                          size="small"
                          value={item.percentage}
                          onChange={e => handleChange(item.id, "percentage", e.target.value)}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>
                          }}
                          sx={{ width: 90 }}
                        />
                      )}

                      {item.calculation_type !== "MANUAL" && (
                        <>
                          <TextField
                            label="Cap"
                            size="small"
                            value={item.cap_amount}
                            onChange={e => handleChange(item.id, "cap_amount", e.target.value)}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₹</InputAdornment>
                            }}
                            sx={{ width: 110 }}
                          />
                        </>
                      )}

                      {item.calculation_type === "COMPONENT %" && (
                        <>
                          <FormControl size="small" sx={{ minWidth: 130 }}>
                            <Select
                              value={item.target_component_id || ""}
                              onChange={e => handleChange(item.id, "target_component_id", e.target.value)}
                            >
                              <MenuItem value="">Select</MenuItem>
                              {formData
                                .filter(c => c.id !== item.id)
                                .map(c => (
                                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </>
                      )}

                      {item.category === "GROSS" && (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={!!item.is_basic_salary}
                              onChange={e => handleChange(item.id, "is_basic_salary", e.target.checked)}
                            />
                          }
                          label="Basic"
                        />
                      )}

                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!item.is_active}
                            onChange={e => handleChange(item.id, "is_active", e.target.checked)}
                          />
                        }
                        label="Active"
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </ActionPopup>
  )
}

export default EditPayrollComponents
