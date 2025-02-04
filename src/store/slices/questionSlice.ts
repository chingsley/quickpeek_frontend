import { getPendingQuestions } from '@/src/services/question';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { QuestionType } from '../../types';

export const fetchPendingQuestions = createAsyncThunk('questions/fetchPendingQuestions', async () => {
  return getPendingQuestions([// id's are hard-coded for now. Might be coming fromt the notification data, or omitted if we implement pending questions in BE database records, in which case the function will not need question ids, just user token which is already added by axios setup
    '07b5e899-b051-4c2e-9702-db27df89b045',
    '1c4357e1-95d6-43e4-8239-9226c97447ba'
  ]);
});

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    questions: [] as QuestionType[],
    pendingQuestions: [] as QuestionType[],
    selectedQuestionId: null as string | null,
    isLoading: false,
  },
  reducers: {
    selectQuestion: (state, action) => {
      state.selectedQuestionId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingQuestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingQuestions = action.payload;
      })
      .addCase(fetchPendingQuestions.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { selectQuestion } = questionSlice.actions;
export default questionSlice.reducer;
