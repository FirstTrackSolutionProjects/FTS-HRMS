import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const FilterComponent = forwardRef(({ filterConfig, onFilterChange }, ref) => {
  const [filters, setFilters] = useState({});
  const debounceRef = useRef(null);

  const formattedParams = Object.entries(filters).reduce((acc, [key, value]) => {
    if (value instanceof Date && !isNaN(value)) {
      acc[key] = value.toISOString(); // Format date
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  const queryParams = new URLSearchParams(formattedParams);

  useEffect(() => {
    const initialFilters = filterConfig.reduce((acc, config) => {
      const { type, field, options, isStartDate } = config;
      let defaultVal = null;

      switch (type) {
        case 'date':
          defaultVal = new Date();
          if (isStartDate) {
            defaultVal.setDate(defaultVal.getDate() - 30);
          }
          break;
        case 'select':
          defaultVal = options?.[0]?.value ?? '';
          break;
        case 'text':
          defaultVal = '';
          break;
        case 'number':
          defaultVal = 0;
          break;
        default:
          defaultVal = '';
      }

      acc[field] = defaultVal;
      return acc;
    }, {});
    setFilters(initialFilters);
  }, [filterConfig]);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    getQueryParams: () => queryParams,
    getFilters: () => filters,
    setFilter: (field, value) =>
      setFilters((prev) => ({ ...prev, [field]: value })),
    resetFilters: () => {
      const resetValues = filterConfig.reduce((acc, config) => {
        const { type, field, options, isStartDate } = config;
        let defaultVal = null;

        switch (type) {
          case 'date':
            defaultVal = new Date();
            if (isStartDate) defaultVal.setDate(defaultVal.getDate() - 30);
            break;
          case 'select':
            defaultVal = options?.[0]?.value ?? '';
            break;
          case 'text':
            defaultVal = '';
            break;
          case 'number':
            defaultVal = 0;
            break;
          default:
            defaultVal = '';
        }

        acc[field] = defaultVal;
        return acc;
      }, {});
      setFilters(resetValues);
    },
  }));

  // Debounced filter change
  const handleChange = (field, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [field]: value };

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFilterChange(updated); // Pass updated filters if needed
      }, 600);

      return updated;
    });
  };

  const renderFilterInput = (config) => {
    const { type, field, label, options } = config;

    switch (type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <TextField
            size="small"
            type={type}
            label={label}
            value={filters[field] ?? ''}
            onChange={(e) => handleChange(field, e.target.value)}
            sx={{ minWidth: 200 }}
          />
        );

      case 'select':
        return (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel sx={{ backgroundColor: 'white' }}>{label}</InputLabel>
            <Select
              value={filters[field] ?? ''}
              label={label}
              onChange={(e) => handleChange(field, e.target.value)}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={label}
              value={filters[field] ?? null}
              onChange={(value) => handleChange(field, value)}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { minWidth: 200 },
                },
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        overflowY: 'hidden',
        gap: 2,
        p: 2,
        alignItems: 'center',
        whiteSpace: 'nowrap',
      
        // Hide scrollbar for Webkit (Chrome, Safari)
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      
        // Hide scrollbar for Firefox
        scrollbarWidth: 'none',
      
        // Optional: Prevent vertical shifting when scrollbar appears
        msOverflowStyle: 'none',
      }}
    >
      {filterConfig.map((config, index) => (
        <Box key={config.field || index}>{renderFilterInput(config)}</Box>
      ))}
    </Box>
  );
});

export default FilterComponent;
