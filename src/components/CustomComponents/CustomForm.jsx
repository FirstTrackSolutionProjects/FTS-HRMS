import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, createRef } from "react";
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment, Typography } from "@mui/material";
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

const CustomForm = forwardRef(({ fields, setFields, handleSubmit, existingData={}, onChange, viewMode }, ref) => {

  const [loadingState, setLoadingState] = useState(null)
  const formDataRef = useRef(null);

  const initialFormData = useRef()

  const [formData, setFormData] = useState(() => {
        const initialData = Object.keys(fields).reduce((acc, key) => {
          if (fields[key].inputType === "multiselect" || fields[key].inputType === "array") {
            acc[key] = existingData[key] || [];
          } else if (fields[key].inputType === "select" && existingData[key]) {
            acc[key] = isNaN(existingData[key]) ? existingData[key] : Number(existingData[key]);
          } else if (fields[key].inputType === "number") {
            acc[key] = isNaN(existingData[key]) ? 0 : Number(existingData[key]);
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



  const formSchema = z.object(
    Object.keys(fields).reduce((schema, key) => {
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
    const newFormData = { ...formData, [name]: value };
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
      console.log(formDataRef?.current)
      formSchema.parse(formDataRef?.current);
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
  }, [existingData, fields, viewMode]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '70%', overflow: 'auto', padding: 1 }}>
      <Grid container spacing={2}>
        {Object.keys(fields).map((key) => {
          if (!fieldRefs.current[key]) {
            fieldRefs.current[key] = createRef();
          }
          const fieldRef = fieldRefs.current[key];
          
          // Skip hidden fields from rendering in the form
          if (fields[key].hidden) {
            return null;
          }

          // Handle array type fields
          if (fields[key].inputType === 'array') {
            if (!arrayFormRefs.current[key]) {
              arrayFormRefs.current[key] = createRef();
            }
            return (
              <Grid item xs={12} key={key}>
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
            <Grid item xs={12} sm={6} key={key}>
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
            <Grid item xs={12} sm={6} key={key}>
              <Typography sx={{fontSize: 13,color: "gray"}}>{`${fields[key].label}${fields[key].required ? '*' : ''}`}</Typography>
              <Box className="flex" gap={1}>
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
            <Grid item xs={12} sm={6} key={key}>
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
            <Grid item xs={12} sm={6} key={key}>
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
            </Grid>
          ): fields[key].inputType === "multiselect" ? (
            <Grid item xs={12} sm={12} key={key}>
              <MultiSelect
                options={fields[key].options || []}
                selectedValues={formData[key] || []}
                setSelectedValues={(values) => setFormData((prevData) => ({ ...prevData, [key]: values }))}
                label={fields[key].label}
                disabled={viewMode}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} key={key}>
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