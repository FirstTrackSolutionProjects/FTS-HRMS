import React from 'react'
import { FaTrash } from "react-icons/fa";

const DeleteIcon = ({onClick}) => {
  return (
    <FaTrash className='cursor-pointer text-red-500' onClick={onClick} />
  )
}

export default DeleteIcon
