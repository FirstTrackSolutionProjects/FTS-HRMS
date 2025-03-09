import { Button } from "@mui/material"
const CustomButton = ({secondary,sx, disabled, title="hello", onClick, color}) => {
  return (
    <Button variant={secondary?'outlined':'contained'} color={color} sx={sx} disabled={disabled} onClick={onClick}>
      {title}
    </Button>
  )
}

export default CustomButton
