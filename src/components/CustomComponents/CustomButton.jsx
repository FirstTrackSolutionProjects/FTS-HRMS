import { Button } from "@mui/material"
const CustomButton = ({secondary,sx, disabled, title="hello", onClick}) => {
  return (
    <Button variant={secondary?'outlined':'contained'} sx={sx} disabled={disabled} onClick={onClick}>
      {title}
    </Button>
  )
}

export default CustomButton
