import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import {
  Box, Typography, TextField, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, TableContainer, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Select, MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import getPayrollComponentPoliciesService from "@/services/getPayrollComponentPoliciesService";

const EmployeePayrollStructure = forwardRef(({ onSubmit, valueMap = {} }, ref) => {
  const [allComponents, setAllComponents] = useState([]);
  const [structure, setStructure] = useState({
    GROSS: [],
    "EMPLOYEE DEDUCTIONS": [],
    "EMPLOYER CONTRIBUTIONS": [],
  });
  const [manualValues, setManualValues] = useState({});
  const [computedValues, setComputedValues] = useState({});
  const [undoStack, setUndoStack] = useState([]);

  const [addDialogCategory, setAddDialogCategory] = useState(null);
  const [selectedAddComponentId, setSelectedAddComponentId] = useState("");

  const hasInitialized = useRef(false);

useEffect(() => {
  if (hasInitialized.current) return; // prevent reinitialization

  const fetchComponents = async () => {
    const data = await getPayrollComponentPoliciesService();
    const active = data.filter((c) => c.is_active);
    setAllComponents(active);

    const structureInit = { GROSS: [], "EMPLOYEE DEDUCTIONS": [], "EMPLOYER CONTRIBUTIONS": [] };
    const manualVals = {};

    active.forEach((component) => {
      if (valueMap[component.id]) {
        structureInit[component.category].push(component);
        if (component.calculation_type === "MANUAL") {
          manualVals[component.id] = valueMap[component.id];
        }
      }
    });

    setStructure(structureInit);
    setManualValues(manualVals);
    hasInitialized.current = true; // mark initialized
  };

  fetchComponents();
}, [valueMap]);


  useEffect(() => {
    recalculate();
  }, [structure, manualValues]);

  const recalculate = () => {
    const flatComponents = Object.values(structure).flat();
    const map = Object.fromEntries(flatComponents.map((c) => [c.id, c]));
    const resolved = {};

    const resolve = (c) => {
      if (resolved[c.id] !== undefined) return resolved[c.id];
      if (c.calculation_type === "MANUAL") return parseFloat(manualValues[c.id]) || 0;
      if (c.calculation_type === "BASIC %") {
        const basic = flatComponents.find((x) => x.is_basic_salary);
        if (!basic) return 0;
        const base = resolve(basic);
        return Math.min((base * c.percentage) / 100, c.cap_amount || Infinity);
      }
      if (c.calculation_type === "GROSS %") {
        const gross = structure["GROSS"].map(resolve).reduce((a, b) => a + b, 0);
        return Math.min((gross * c.percentage) / 100, c.cap_amount || Infinity);
      }
      if (c.calculation_type === "COMPONENT %" && c.target_component_id) {
        const base = resolve(map[c.target_component_id] || {});
        return Math.min((base * c.percentage) / 100, c.cap_amount || Infinity);
      }
      return 0;
    };

    flatComponents.forEach((c) => {
      resolved[c.id] = resolve(c);
    });

    setComputedValues(resolved);
  };

  const handleInput = (id, val) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setManualValues((prev) => ({ ...prev, [id]: val }));
    }
  };

  const handleRemove = (category, id) => {
    const flatComponents = Object.values(structure).flat();
    const dependents = flatComponents.filter((c) => c.target_component_id === id);
    if (dependents.length) {
      const names = dependents.map((d) => d.name).join(", ");
      if (!window.confirm(`This component is referenced by: ${names}. Removing it will also remove them. Continue?`)) return;
    }

    const updated = { ...structure };
    const toRemove = new Set([id, ...dependents.map((d) => d.id)]);
    for (const cat in updated) {
      updated[cat] = updated[cat].filter((c) => !toRemove.has(c.id));
    }

    setUndoStack((prev) => [...prev, structure]);
    setStructure(updated);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack.pop();
    setStructure(prev);
    setUndoStack([...undoStack]);
  };

  const handleAdd = (category) => {
    setAddDialogCategory(category);
    setSelectedAddComponentId("");
  };

  const handleConfirmAdd = () => {
  if (!selectedAddComponentId) return;

  const comp = allComponents.find((c) => c.id === selectedAddComponentId);
  if (!comp) return;

  setStructure((prevStructure) => {
    const newStructure = {
      ...prevStructure,
      [addDialogCategory]: [...prevStructure[addDialogCategory], comp],
    };
    setUndoStack((prevStack) => [...prevStack, prevStructure]); // save previous structure
    return newStructure;
  });

  setAddDialogCategory(null);
};


  const renderRow = (c, category) => {
    const val = computedValues[c.id] || 0;
    return (
      <TableRow key={c.id}>
        <TableCell>{c.name} {c.is_basic_salary ? "(Basic)" : ""}</TableCell>
        <TableCell>{c.calculation_type}</TableCell>
        <TableCell>
          {c.calculation_type === "MANUAL" ? (
            <TextField
              size="small"
              type="number"
              value={manualValues[c.id] || ""}
              onChange={(e) => handleInput(c.id, e.target.value)}
              sx={{ width: 100 }}
            />
          ) : (
            `₹${val.toFixed(2)}`
          )}
        </TableCell>
        <TableCell>₹{(val / 12).toFixed(2)}</TableCell>
        <TableCell>
          <IconButton onClick={() => handleRemove(category, c.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  const getSum = (cat) => structure[cat].reduce((a, c) => a + (computedValues[c.id] || 0), 0);
  const gross = getSum("GROSS");
  const deductions = getSum("EMPLOYEE DEDUCTIONS");
  const employer = getSum("EMPLOYER CONTRIBUTIONS");

  useImperativeHandle(ref, () => ({
    getStructure: () => structure,
    getValues: () => computedValues,
    getCTC: () => gross + employer,
    submitForm: onSubmit
  }));

  return (
    <Box sx={{width: "100%"}}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Component</TableCell>
              <TableCell>Calculation</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Monthly</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {["GROSS", "EMPLOYEE DEDUCTIONS", "EMPLOYER CONTRIBUTIONS"].map((cat) => (
  <React.Fragment key={cat}>
    <TableRow>
      <TableCell colSpan={5} sx={{ fontWeight: "bold", background: "#f5f5f5" }}>
        {cat}
        <IconButton onClick={() => handleAdd(cat)} size="small" sx={{ ml: 1 }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>

    {structure[cat].map((c) => renderRow(c, cat))}

    {/* Total row */}
    <TableRow>
      <TableCell colSpan={2} sx={{ fontWeight: "bold" }}>
        Total {cat}
      </TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>
        ₹{getSum(cat).toFixed(2)}
      </TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>
        ₹{(getSum(cat) / 12).toFixed(2)}
      </TableCell>
      <TableCell />
    </TableRow>

    {/* In-hand Salary after Employee Deductions */}
    {cat === "EMPLOYEE DEDUCTIONS" && (
      <TableRow>
        <TableCell colSpan={2} sx={{ fontWeight: "bold", backgroundColor: "#fffbe6" }}>
          In-hand Salary
        </TableCell>
        <TableCell sx={{ fontWeight: "bold", backgroundColor: "#fffbe6" }}>
          ₹{(gross - deductions).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontWeight: "bold", backgroundColor: "#fffbe6" }}>
          ₹{((gross - deductions) / 12).toFixed(2)}
        </TableCell>
        <TableCell sx={{ backgroundColor: "#fffbe6" }} />
      </TableRow>
    )}

    {/* CTC after Employer Contributions */}
    {cat === "EMPLOYER CONTRIBUTIONS" && (
      <TableRow>
        <TableCell colSpan={2} sx={{ fontWeight: "bold", backgroundColor: "#e6f7ff" }}>
          Final CTC
        </TableCell>
        <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e6f7ff" }}>
          ₹{(gross + employer).toFixed(2)}
        </TableCell>
        <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e6f7ff" }}>
          ₹{((gross + employer) / 12).toFixed(2)}
        </TableCell>
        <TableCell sx={{ backgroundColor: "#e6f7ff" }} />
      </TableRow>
    )}
  </React.Fragment>
))}


          </TableBody>
        </Table>
      </TableContainer>

      <Button onClick={handleUndo} disabled={undoStack.length === 0} sx={{ mt: 2 }}>
        Undo Last Action
      </Button>

      <Dialog open={!!addDialogCategory} onClose={() => setAddDialogCategory(null)}>
        <DialogTitle>Add Component to {addDialogCategory}</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedAddComponentId}
            size="small"
            onChange={(e) => setSelectedAddComponentId(e.target.value)}
          >
            {allComponents
              .filter((c) => c.category === addDialogCategory)
              .filter((c) =>
                !Object.values(structure).flat().some((e) => e.id === c.id))
              .map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} ({c.calculation_type})
                </MenuItem>
              ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogCategory(null)}>Cancel</Button>
          <Button disabled={!selectedAddComponentId} onClick={handleConfirmAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default EmployeePayrollStructure;
