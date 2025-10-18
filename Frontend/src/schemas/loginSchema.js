import * as Yup from "yup";

const loginSchema = Yup.object({
    email : Yup.string().email("Invalid Email Format").required("Email is required."),
    password : Yup.string().required("Password is required."),
});

export {loginSchema}