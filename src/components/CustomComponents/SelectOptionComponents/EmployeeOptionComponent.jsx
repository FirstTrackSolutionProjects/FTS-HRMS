import React from 'react'

const EmployeeOptionComponent = ({first_name, last_name, id}) => {
  return (
    <div>
      {id} - {first_name} {last_name}
    </div>
  )
}

export default EmployeeOptionComponent
