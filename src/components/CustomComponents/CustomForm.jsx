import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, createRef } from "react";
import { Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment, FormLabel, Typography } from "@mui/material";
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

const CustomForm = forwardRef(({ fields, setFields, handleSubmit, existingData={} }, ref) => {

  const [loadingState, setLoadingState] = useState(null)

  const [formData, setFormData] = useState(Object.fromEntries(Object.keys(fields).map(key => {
      if (fields[key].inputType=="multiselect"){
        return [key, []];
      }
      return [key, existingData[key] || ""];
    })));

    useEffect(()=>{
      console.log(formData)
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

  useImperativeHandle(ref, () => ({
    submitForm: () => validateForm(),
    formData: formData,
    setFormData: setFormData,
    files: files,
    setFiles: setFiles,
    loadingState: loadingState,
    setLoadingState: setLoadingState
  }));

  useEffect(() => {
    const changedFields = Object.keys(formData).filter(
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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (value, name) => {
    if (value && !fields[name]?.allowedTypes?.includes(value.type)) {
      toast.error(fields[name]?.unsupportedTypeMessages);
      setFiles((prevFiles) => ({ ...prevFiles, [name]: null }));
      return;
    }
    setFormData((prevData) => ({ ...prevData, [name]: '' }));
    setFiles((prevFiles) => ({ ...prevFiles, [name]: value }));
  };

  const handleUpload = async (name) => {
    try {
      if (!files[name] || formData[name]) return;
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
      formSchema.parse(formData);
      uploadFiles();
    } catch (err) {
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
      const newFormData = { ...formData };
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '70%', overflow: 'hidden', padding: 1 }}>
      <Grid container spacing={2}>
        {Object.keys(fields).map((key) => {
          if (!fieldRefs.current[key]) {
            fieldRefs.current[key] = createRef();
          }
          const fieldRef = fieldRefs.current[key];
          return (
          fields[key].inputType === 'select' ? (
            <Grid item xs={12} sm={6} key={key}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ backgroundColor: 'white' }}>{fields[key].label}{fields[key].required ? '*' : ''}</InputLabel>
                <Select
                  name={key}
                  value={formData[key]}
                  onChange={handleFormDataChange}
                  disabled={fields[key].disabled || !fields[key]?.options?.length}
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
              <Box className="flex"  gap={1}>
              <MuiFileInput
                // label={`${fields[key].label}${fields[key].required ? '*' : ''}`}
                sx={{
                  display: "none"
                }}
                value={files[key]}
                placeholder={''}
                ref={fieldRef}
                name={key}
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
              <CustomButton 
                sx={{
                 padding: 0,
                 minWidth:40,
                 height: 40,
                 width: "100%"
                }} 
                Component={<FileAttachmentIcon />}
                onClick={() => {
                  // Trigger the internal file input of MuiFileInput
                  console.log(fieldRefs)
                  if (fieldRefs?.current[key]?.current) {
                    console.log(fieldRefs?.current[key]?.current)
                    fieldRefs?.current[key]?.current?.querySelector(`input`)?.click()
                  }
                }}
              />
              <CustomButton 
                sx={{
                 padding: 0,
                 minWidth:40,
                 height: 40,
                 width: "100%"
                }} 
                disabled={!files[key]}
                Component={<ClearFieldIcon color="white" />}
              />
              <CustomButton 
                sx={{
                  padding: 0,
                 minWidth:40,
                 height: 40,
                 width: "100%"
                }} 
                disabled={!files[key]}
                Component={<ViewIcon color="white" />}
              />
              <CustomButton 
                sx={{
                  padding: 0,
                 minWidth:40,
                 height: 40,
                 width: "100%"
                }} 
                disabled={!formData[key]}
                Component={<FileAttachmentIcon color="white" />}
              />
              </Box>
            </Grid>
          ) : fields[key].inputType === 'photo' ? (
            <React.Fragment key={key}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={files[key] ? URL.createObjectURL(files[key]) : formData[key] || '/person.webp'}
                  alt={fields[key].label}
                  style={{ width: 90, maxHeight: 120, borderRadius: 8, cursor: 'pointer' }}
                  onClick={() => {
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
                name={key}
                value={formData[key]}
                onChange={handleFormDataChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          ) : fields[key].inputType === "multiselect" ? (
            <Grid item xs={12} sm={12} key={key}>
              <MultiSelect
                options={fields[key].options || []}
                selectedValues={formData[key] || []}
                setSelectedValues={(values) => setFormData((prevData) => ({ ...prevData, [key]: values }))}
                label={fields[key].label}
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={`${fields[key].label}${fields[key].required ? '*' : ''}`}
                variant="outlined"
                size="small"
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