import { configureStore } from '@reduxjs/toolkit'
import formUuidReducer from './formUuidSlice/formUuidSlice'

export default configureStore({
  reducer: {
    formUuid : formUuidReducer
  }
})