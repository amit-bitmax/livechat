import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/baseQuery';

// create user
export const createUser = createAsyncThunk("user/signup", async (formData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('user/signup', formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});
export const loginUser = createAsyncThunk('users/login', async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('user/login', data);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const userProfile = createAsyncThunk('user/profile', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/user/profile');
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});
// Get All users
export const getAllUser = createAsyncThunk("user/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('users', { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

// Get Single Blog
export const getSingleUser = createAsyncThunk("user/getSingle", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`user/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});



// Delete Blog
export const deleteUser = createAsyncThunk("user/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`user/${id}`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});
const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        users: [],
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(loginUser.pending, (state) => { state.loading = true; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Profile
            .addCase(userProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(userProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // createUser
            .addCase(createUser.pending, (state) => { state.loading = true; })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllUser
            .addCase(getAllUser.pending, (state) => { state.loading = true; })
            .addCase(getAllUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data;
            })
            .addCase(getAllUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getSingleUser
            .addCase(getSingleUser.pending, (state) => { state.loading = true; })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.loading = false;
                state.blog = action.payload.data;
            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deleteUser
            .addCase(deleteUser.pending, (state) => { state.loading = true; })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((b) => b._id !== action.payload._id);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
