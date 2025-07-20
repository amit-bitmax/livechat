import React, { useState, useMemo, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Grid, Typography, IconButton, Stack,
    Divider
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const IMG_BASE_URL = "http://localhost:5000/uploads/profiles";

const UserModal = ({ open, handleClose, initialValues, onSubmit }) => {
    const [previewImage, setPreviewImage] = useState("");

    // Validation schema
    const validationSchema = useMemo(() =>
        yup.object({
            title: yup.string().required("Title is required"),
            description: yup.string().required("Description is required"),
            blogImage: yup.mixed().required("Blog image is required"),
        }), []);

    // Formik setup
    const formik = useFormik({
        validationSchema,
        initialValues: initialValues || {
            title: '',
            description: '',
            blogImage: null
        },
        onSubmit: values => {
            onSubmit(values);
        }
    });

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue("blogImage", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
        if (initialValues?.blogImage && !previewImage) {
            setPreviewImage(`${IMG_BASE_URL}/${initialValues.blogImage}`);
        }
    }, [initialValues, previewImage]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <Box sx={{
                p: 2, backgroundImage: "linear-gradient(to left,rgb(246, 246, 246), rgba(187, 226, 202, 0.86),rgb(246, 246, 246))",
                backgroundColor: "transparent",
            }}>
                <DialogTitle>{initialValues?._id ? "Edit Blog" : "Create Blog"}</DialogTitle>
                <Divider />
                <Box component={'form'} onSubmit={formik.handleSubmit}>
                    {/* Image Upload */}
                    <Grid size={{ xs: 12 }} textAlign="center">
                        <Stack direction="row" justifyContent="center" alignItems="center">
                            <Box
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: "50%",
                                    backgroundColor: "#F1F2F5",
                                    backgroundImage: previewImage ? `url(${previewImage})` : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                }}
                            >
                                <IconButton component="label" sx={{ backgroundColor: "rgba(0,0,0,0.4)", width: 80, height: 80 }}>
                                    <AddAPhotoIcon sx={{ fontSize: 25, color: "#fff", display: previewImage ? "none" : "block" }} />
                                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                                </IconButton>
                            </Box>
                        </Stack>
                        {formik.touched.blogImage && formik.errors.blogImage && (
                            <Typography variant="caption" color="error">
                                {formik.errors.blogImage}
                            </Typography>
                        )}
                    </Grid>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body1">Title*</Typography>
                                <TextField
                                    sx={{ border: '1px solid rgba(187, 226, 202, 0.86)', borderRadius: '5px' }}
                                    placeholder="Title"
                                    name="title"
                                    fullWidth
                                    size="small"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body1">Description*</Typography>
                                <TextField
                                    sx={{ border: '1px solid rgba(187, 226, 202, 0.86)', borderRadius: '5px' }}
                                    placeholder="Description"
                                    name="description"
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    size="small"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="error">Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Processing..." : initialValues?._id ? "Update" : "Create"}
                        </Button>
                    </DialogActions>
                </Box>
            </Box>
        </Dialog>
    );
};

export default UserModal;
