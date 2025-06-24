import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, createRef } from "react";
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment, Typography, Switch, FormControlLabel } from "@mui/material";
import { toast } from "react-toastify";
import { MuiFileInput } from 'mui-file-input';
import MultiSelect from "@/components/CustomComponents/MultiSelect";
import FileAttachmentIcon from '@/icons/FileAttachmentIcon';
import ClearFieldIcon from "@/icons/ClearFieldIcon";
import getS3PutUrlService from "@/services/getS3PutUrlService";
import { z } from "zod";
import s3FileUploadService from "@/services/s3FileUploadService";
import ViewIcon from "@/icons/ViewIcon";
import CustomButton from "./CustomButton";
import CustomArrayForm from "./CustomArrayForm";

const bucketUrl = import.meta.env.VITE_APP_BUCKET_URL

const CustomForm = forwardRef(({ fields, setFields, handleSubmit, existingData={}, onChange, viewMode, gridColumns = 12 }, ref) => {

  const [loadingState, setLoadingState] = useState(null)
  const formDataRef = useRef(null);

  const initialFormData = useRef()
  const [formData, setFormData] = useState(() => {
        const initialData = Object.keys(fields).reduce((acc, key) => {
          // Get defaultValue or appropriate empty value based on input type
          const getDefaultValue = (field) => {
            if (field.defaultValue !== undefined) return field.defaultValue;
            if (field.inputType === "multiselect" || field.inputType === "array") return [];
            if (field.inputType === "number") return 0;
            if (field.inputType === "switch") return false;
            return "";
          };          if (fields[key].inputType === "multiselect" || fields[key].inputType === "array") {
            acc[key] = existingData[key] !== undefined ? existingData[key] : getDefaultValue(fields[key]);
          } else if (fields[key].inputType === "select" && existingData[key]) {
            acc[key] = isNaN(existingData[key]) ? existingData[key] : Number(existingData[key]);
          } else if (fields[key].inputType === "number") {
            acc[key] = existingData[key] !== undefined ? Number(existingData[key]) : getDefaultValue(fields[key]);
          } else if (fields[key].inputType === "switch") {
            acc[key] = existingData[key] !== undefined ? Boolean(existingData[key]) : getDefaultValue(fields[key]);
          } else if (fields[key].inputType === "expression") {
            try {
              if (typeof fields[key].function === 'function') {
                acc[key] = fields[key].function(existingData);
              } else {
                acc[key] = '';
              }
            } catch (error) {
              console.error(`Error evaluating expression for ${key}:`, error);
              acc[key] = '';
            }
          } else {
            acc[key] = existingData[key] || "";
          }
          return acc;
        }, {});
        formDataRef.current = initialData;
        initialFormData.current = initialData;
        return initialData;
      });

    useEffect(()=>{
      console.log(formData)
      console.log(initialFormData)
      formDataRef.current = formData;
    },[formData])

  const [files, setFiles] = useState(
      Object.keys(fields)
        .filter((key) =>  [ "file", "photo"].includes(fields[key]?.inputType))
        .reduce((acc, key) => {
          acc[key] = null;
          return acc;
        }, {})
    );


  

  const prevFormData = useRef(formData);
  const photoFileRef = useRef();
  const [uploadCompleted, setUploadCompleted] = useState(null);

  const initializeFormData = (data) => {
    setFormData(data);
    initialFormData.current = data;
  }
  useImperativeHandle(ref, () => ({
    submitForm: () => validateForm(),
    formData: {
      ...formDataRef?.current,
      ...Object.keys(arrayFormRefs.current).reduce((acc, key) => {
        if (arrayFormRefs.current[key]?.current) {
          acc[key] = arrayFormRefs.current[key].current.formsData;
        }
        return acc;
      }, {})
    },
    initializeFormData: initializeFormData,
    setFormData: setFormData,
    files: files,
    setFiles: setFiles,
    loadingState: loadingState,
    setLoadingState: setLoadingState,
    arrayFormRefs: arrayFormRefs.current
  }));

  useEffect(() => {
    const changedFields = Object.keys(formDataRef?.current).filter(
      (key) => formData[key] !== prevFormData.current[key]
    );

    if (changedFields.length > 0) {
      Object.keys(fields).forEach(async (key) => {
        if (["select", "multiselect"].includes(fields[key].inputType)) {
          const dependencyChanged = changedFields.includes(fields[key]?.dependOn);
          if (dependencyChanged && formData[fields[key]?.dependOn]) {
            try {
              const options = await fields[key].getOptions(formData[fields[key]?.dependOn]);
              setFields((prevData) => ({ ...prevData, [key]: { ...prevData[key], options } }));
            } catch (err) {
              toast.error(`Failed to fetch ${fields[key].label}`);
            }
          }
        }
      });
    }

    prevFormData.current = formData;
  }, [formData]);

  useEffect(() => {
    Object.keys(fields).forEach(async (key) => {
      if (["select", "multiselect"].includes(fields[key].inputType) && !fields[key]?.dependOn) {
        try {
          const options = await fields[key].getOptions();
          setFields((prevData) => ({ ...prevData, [key]: { ...prevData[key], options } }));
        } catch (err) {
          toast.error(`Failed to fetch ${fields[key].label}`);
        }
      }
    });
  }, []);

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };    // Update expression fields that depend on the changed field
    Object.keys(fields).forEach(key => {
      if (fields[key].inputType === 'expression' && typeof fields[key].function === 'function') {
        try {
          newFormData[key] = fields[key].function(newFormData);
        } catch (error) {
          console.error(`Error evaluating expression for ${key}:`, error);
        }
      }
    });

    setFormData(newFormData);
    onChange?.(newFormData); // Call onChange if provided
  };

  const handleFileChange = (value, name) => {
    if (value && !fields[name]?.allowedTypes?.includes(value.type)) {
      toast.error(fields[name]?.unsupportedTypeMessages);
      setFiles((prevFiles) => ({ ...prevFiles, [name]: null }));
      return;
    }
    if (value){
      setFormData((prevData) => ({ ...prevData, [name]: '' }));
      setFiles((prevFiles) => ({ ...prevFiles, [name]: value }));
    }
  };

  useEffect(() => {
    console.log(files)
  },[files])
  const handleUpload = async (name) => {
    try {
      if (!files[name] || formDataRef?.current?.[name]) return;
      const key = fields[name].key;
      const file = files[name];
      const filetype = file.type;
      const uploadUrl = await getS3PutUrlService(key, filetype);
      await s3FileUploadService(uploadUrl, file, filetype);
      return { success: true, key: name, value: key };
    } catch (error) {
      toast.error(`Error uploading ${fields[name]?.label}, Please try again`);
      return { success: false, key: name };
    }
  };
  const validateForm = () => {
    try {
      // Create a copy of current form data
      const dataToValidate = { ...formDataRef.current };
      // Remove hidden or conditionally hidden fields from validation and submission
      Object.keys(fields).forEach(key => {
        if (fields[key].hidden || (typeof fields[key].conditions === 'function' && !fields[key].conditions(formDataRef.current))) {
          delete dataToValidate[key];
        }
      });

      const formSchema = z.object(
        Object.keys(fields).reduce((schema, key) => {
          if (fields[key].hidden || (typeof fields[key].conditions === 'function' && !fields[key].conditions(formDataRef.current))) {
            return schema;
          }
          if (fields[key].validation) {
            schema[key] = fields[key].validation;
          } else if (fields[key].required) {
            if (fields[key].inputType === "multiselect") {
              schema[key] = z.array(z.string()).min(1, `${fields[key].label} is required`);
            } else {
              schema[key] = z.string().min(1, `${fields[key].label} is required`);
            }
          }
          return schema;
        }, {})
      );
      
      // Validate only visible fields
      formSchema.parse(dataToValidate);
      // Only pass visible fields to uploadFiles and submission
      formDataRef.current = dataToValidate;
      uploadFiles();
    } catch (err) {
      console.error(err);
      if (err.errors) {
        err.errors.forEach(error => {
          toast.error(error.message);
        });
      } else {
        toast.error(err.message || "Form validation failed");
      }
    }
  };

  const uploadFiles = async () => {
    setUploadCompleted(null);
    if (!files) {
      setUploadCompleted(true);
      return;
    }
    setLoadingState('Uploading Files...');
    try {
      const uploadResults = await Promise.all(
        Object.keys(files).map((key) => handleUpload(key))
      );
      const failedUploads = uploadResults.filter(result => result && !result?.success);
      if (failedUploads.length) {
        toast.error(`Failed to upload files for ${failedUploads.map(upload => upload.key).join(', ')}`);
        return;
      }
      const successfulUploads = uploadResults.filter(result => result && result.success);
      const newFormData = { ...formDataRef?.current };
      successfulUploads.forEach(({ key, value }) => {
        newFormData[key] = value;
      });
      await new Promise(resolve => {
        setFormData(newFormData);
        resolve();
      });
      setUploadCompleted(true);
    } catch (error) {
      toast.error("Error submitting form: " + error.message);
    } finally {
      setLoadingState(null);
    }
  };

  useEffect(() => {
    if (uploadCompleted) {
      handleSubmit();
    }
  }, [uploadCompleted]);

  const fieldRefs = useRef({});
  const arrayFormRefs = useRef({});

  const handleArrayFormChange = (key, data) => {
    setFormData(prev => ({
      ...prev,
      [key]: data
    }));
    onChange?.({ ...formData, [key]: data });
  };

  // Add useEffect to handle existingData changes
  useEffect(() => {
    if (existingData && Object.keys(existingData).length > 0) {
      const newFormData = Object.keys(fields).reduce((acc, key) => {
        acc[key] = existingData[key] !== undefined ? existingData[key] : formData[key];
        return acc;
      }, {});
      setFormData(newFormData);
      formDataRef.current = newFormData;
      initialFormData.current = newFormData;
    }
  }, [existingData, viewMode]);

  const getGridSize = (field) => {
    const colSpan = field.colSpan || 6; // Default to 6 columns (half width) if not specified
    return {
      xs: 12, // Always full width on mobile
      sm: Math.min(colSpan, gridColumns), // Respect the colSpan but don't exceed gridColumns
    };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '70%', overflow: 'auto', padding: 1 }}>
      <Grid container spacing={2}>
        {Object.keys(fields).map((key) => {
          if (!fieldRefs.current[key]) {
            fieldRefs.current[key] = createRef();
          }
          const fieldRef = fieldRefs.current[key];
            // Skip hidden fields and handle conditional rendering
          if (fields[key].hidden || (typeof fields[key].conditions === 'function' && !fields[key].conditions(formData))) {
            // If field is hidden by condition, restore its default value
            if (fields[key].conditions && !fields[key].conditions(formData)) {
                const defaultValue = fields[key].defaultValue !== undefined
                  ? fields[key].defaultValue
                  : fields[key].inputType === "multiselect" || fields[key].inputType === "array" ? []
                  : fields[key].inputType === "number" ? 0
                  : fields[key].inputType === "switch" ? false
                  : "";
                          
                // Only update if value is actually different (deep compare for arrays)
                const isDifferent = Array.isArray(formData[key])
                  ? JSON.stringify(formData[key]) !== JSON.stringify(defaultValue)
                  : formData[key] !== defaultValue;
                          
                if (isDifferent) {
                  setTimeout(() => {
                    setFormData(prev => ({
                      ...prev,
                      [key]: defaultValue
                    }));
                  }, 0);
                }
              }
            return null;
          }

          // Handle array type fields
          if (fields[key].inputType === 'array') {
            if (!arrayFormRefs.current[key]) {
              arrayFormRefs.current[key] = createRef();
            }
            return (
              <Grid item {...getGridSize(fields[key])} key={key}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>{fields[key].label}</Typography>
                <CustomArrayForm
                  ref={arrayFormRefs.current[key]}
                  fields={fields[key].fields}
                  required={fields[key].required}
                  setFields={setFields}
                  existingData={formData[key] || []}
                  viewMode={viewMode}
                  onChange={(data) => handleArrayFormChange(key, data)}
                />
              </Grid>
            );
          }

          return (
          fields[key].inputType === 'select' ? (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ backgroundColor: 'white' }}>{fields[key].label}{fields[key].required ? '*' : ''}</InputLabel>
                <Select
                  name={key}
                  value={formData[key]}
                  onChange={handleFormDataChange}
                  disabled={fields[key].disabled || !fields[key]?.options?.length || viewMode}
                  fullWidth
                >
                  <MenuItem key={'null'} value={''}>{'Select'}</MenuItem>
                  {fields[key]?.options?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>{option?.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : fields[key].inputType === 'file' ? (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <Typography sx={{fontSize: 13,color: "gray"}}>{`${fields[key].label}${fields[key].required ? '*' : ''}`}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={fieldRef}
                  name={key}
                  onChange={(e) => handleFileChange(e.target.files[0], key)}
                />
                <CustomButton 
                  sx={{
                    padding: 0,
                    minWidth: 40,
                    height: 40,
                    width: "100%"
                  }} 
                  Component={<FileAttachmentIcon color="white" />}
                  onClick={() => fieldRef.current?.click()}
                  disabled={viewMode}
                />
                <CustomButton 
                  color={'error'}
                  sx={{
                    padding: 0,
                    minWidth: 40,
                    height: 40,
                    width: "100%"
                  }} 
                  disabled={!files[key] || viewMode}
                  Component={<ClearFieldIcon color="white" />}
                  onClick={() => {
                    setFiles(prev => ({ ...prev, [key]: null }));
                    setFormData(prev => ({ ...prev, [key]: "" }));
                  }}
                />
                <CustomButton 
                  sx={{
                    padding: 0,
                    minWidth: 40,
                    height: 40,
                    width: "100%"
                  }} 
                  disabled={!files[key] || viewMode}
                  Component={<ViewIcon color="white" />}
                  onClick={() => {
                    if (files[key]) {
                      const url = URL.createObjectURL(files[key]);
                      window.open(url, '_blank');
                    }
                  }}
                />
                <CustomButton
                  color={'success'} 
                  sx={{
                    padding: 0,
                    minWidth: 40,
                    height: 40,
                    width: "100%"
                  }} 
                  disabled={!initialFormData?.current?.[key]}
                  Component={<FileAttachmentIcon color="white" />}
                  onClick={() => {
                    if (initialFormData?.current?.[key]) {
                      window.open(`${bucketUrl}${initialFormData?.current?.[key]}`, '_blank');
                    }
                  }}
                />
              </Box>
            </Grid>
          ) : fields[key].inputType === 'photo' ? (
            <React.Fragment key={key}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={
                    files[key]
                      ? URL.createObjectURL(files[key])
                      : formData[key]
                      ? `${bucketUrl}${formData[key]}`
                      : '/person.webp'
                  }
                  
                  alt={fields[key].label}
                  style={{ width: 90, maxHeight: 120, borderRadius: 8, cursor: 'pointer' }}
                  onClick={() => {
                    if (viewMode) return;
                    // Trigger the internal file input of MuiFileInput
                    if (photoFileRef.current) {
                      photoFileRef.current.querySelector('input')?.click();
                    }
                  }}
                />
              </Grid>
                
              <Grid item xs={12}>
                <div ref={photoFileRef}>
                  <MuiFileInput
                    label={`${fields[key].label}${fields[key].required ? '*' : ''}`}
                    value={files[key]}
                    placeholder={'Select Image'}
                    name="photo"
                    sx={{
                      display: "none"
                    }}
                    size="small"
                    onChange={(value) => handleFileChange(value, key)}
                    fullWidth
                    clearIconButtonProps={{
                      title: "Remove",
                      children: <ClearFieldIcon />
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FileAttachmentIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
              </Grid>
            </React.Fragment>
          ) : fields[key].inputType === "date" ? (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <TextField
                label={`${fields[key].label}${fields[key].required ? '*' : ''}`}
                variant="outlined"
                size="small"
                type="date"
                disabled={viewMode}
                name={key}
                value={formData[key]}
                onChange={handleFormDataChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          ) : fields[key].inputType === "time" ? (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <TextField
                label={`${fields[key].label}${fields[key].required ? '*' : ''}`}
                variant="outlined"
                size="small"
                type="time"
                disabled={viewMode}
                name={key}
                value={formData[key]}
                onChange={handleFormDataChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>          ): fields[key].inputType === "multiselect" ? (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <MultiSelect
                options={fields[key].options || []}
                selectedValues={formData[key] || []}
                setSelectedValues={(values) => setFormData((prevData) => ({ ...prevData, [key]: values }))}
                label={fields[key].label}
                disabled={viewMode}
              />
            </Grid>
          ) : fields[key].inputType === "switch" ? (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(formData[key])}
                    onChange={(e) => {
                      const { checked } = e.target;
                      const newFormData = { ...formData, [key]: checked };
                      setFormData(newFormData);
                      onChange?.(newFormData);
                    }}
                    name={key}
                    disabled={viewMode}
                  />
                }
                label={`${fields[key].label}${fields[key].required ? '*' : ''}`}
              />
            </Grid>          
            ) : fields[key].inputType === "textField" ? (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <TextField
                label={`${fields[key].label}${fields[key].required ? '*' : ''}`}
                variant="outlined"
                size="small"
                disabled={viewMode}
                name={key}
                value={formData[key]}
                onChange={handleFormDataChange}
                fullWidth
                multiline
                rows={3}
                inputProps={{
                  maxLength: fields[key].maxLength
                }}
                helperText={fields[key].maxLength ? `${(formData[key] || '').length}/${fields[key].maxLength}` : undefined}
              />
            </Grid>          ) : fields[key].inputType === "expression" ? (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <TextField
                label={`${fields[key].label}${fields[key].required ? '*' : ''}`}                variant="outlined"
                size="small"
                disabled={true}
                name={key}
                value={formData[key]}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          ) : (
            <Grid item {...getGridSize(fields[key])} key={key}>
              <TextField
                label={`${fields[key].label}${fields[key].required ? '*' : ''}`}
                variant="outlined"
                size="small"
                disabled={viewMode}
                name={key}
                value={formData[key]}
                onChange={handleFormDataChange}
                fullWidth
              />
            </Grid>
          )
        )})}
      </Grid>
    </Box>
  );
});

export default CustomForm;