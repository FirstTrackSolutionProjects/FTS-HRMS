import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react';
import { Pagination as MuiPagination, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(MuiPagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: theme.palette.text.primary,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const CustomPagination = forwardRef(({ onChange, sx }, ref) => {
  const [config, setConfig] = useState({
    page: 1,         // Pagination in MUI is 1-based
    totalPages: 0
  });
  const [flag, setFlag] = useState(false);

  useImperativeHandle(ref, () => ({
    config: config,
    setConfig: (value) => setConfig(value)
  }));

  const getSiblingCount = (totalPages) => {
    return totalPages <= 7 ? 1 : 1;
  };

  useEffect(()=>{
    onChange()
  },[flag])

  return (
    <Stack spacing={2} sx={{ mt: 2, ...sx }}>
      <StyledPagination
        page={config.page}
        count={config.totalPages}
        onChange={(e, value) => {
          setConfig((prev) => ({ ...prev, page: value }));
          setFlag((prev)=>!prev)
        }}
        size="medium"
        siblingCount={getSiblingCount(config.totalPages)}
        boundaryCount={1}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
});

export default CustomPagination;
