import * as Yup from "yup";

const signUpSchema = Yup.object({
    fullName : Yup.string().min(3 , "Full name must be at least 3 characters").required("Full name is required."),
    userName : Yup.string().min(3 , " Username must be at least 3 characters").required(" Username is required."),
    email : Yup.string().email("Invalid Email Format").required("Email is required."),
    password : Yup.string().min(6 , "Password must be at least 6 characters").required("Password is required."),
    role : Yup.string().oneOf(["student", "teacher", "admin"], "Invalid role").required("Role is required"),
})

export { signUpSchema }