import * as yup from "yup";

export const productValidationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    brand: yup.string().required("Brand is required"),
    categoryId: yup.string().required("Category is required"),
    color: yup.string().required("Color is required"),
    model: yup.string().required("Model is required"),
    price: yup.number().required("Price is required"),
    discount: yup.number().min(0).max(100),
    reviews: yup.number().min(0),
    rating: yup.number().min(0).max(5),
    size: yup.string().required("Size is required"),
    productImage: yup.mixed().required("Product image is required"),
});
