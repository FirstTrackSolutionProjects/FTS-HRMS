import { Button } from "@mui/material"
const CustomButton = ({secondary,sx, disabled, title="hello"}) => {
  return (
    <Button variant={secondary?'outlined':'contained'} sx={sx} disabled={disabled}>
      {title}
    </Button>
  )
}

export default CustomButton
