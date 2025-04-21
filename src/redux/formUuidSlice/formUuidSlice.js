import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

const initialState = {
  uuid: v4()
};

const formUuidSlice = createSlice({
  name: "formUuid",
  initialState,
  reducers: {
    refreshFormUuid: (state, action) => {
        state.uuid = v4()
    },
  },
});

export const { refreshFormUuid } = formUuidSlice.actions;
export default formUuidSlice.reducer;
