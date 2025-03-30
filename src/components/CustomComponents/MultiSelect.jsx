import React from "react";
import { Autocomplete, TextField, Checkbox } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const MultiSelect = ({ options, selectedValues, setSelectedValues, label }) => {
  return (
    <Autocomplete
      multiple
      options={options}
      size="small"
      sx={{
        mt:3
      }}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      value={options.filter(option => selectedValues.includes(option.id))}
      onChange={(event, newValue) => setSelectedValues(newValue.map(option => option.id))}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            size="small"
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label={label} />} 
    />
  );
};

export default MultiSelect;
