import React from 'react';
import styles from "./SignUp.module.css";
import {Formik , useFormik } from "formik"
import {Link, useNavigate} from "react-router-dom"
import { signUpSchema } from '../../schemas/signupSchema';
import { api } from '../../api/axios';
import toast from "react-hot-toast";

function SignUp() {
  const navigate = useNavigate();

  const {values , errors , touched ,  handleSubmit , handleChange , handleBlur} = useFormik({
    initialValues : {
      fullName : "",
      userName : "",
      email : "",
      password : "",
      role : ""
    },
    validationSchema : signUpSchema,
    onSubmit : async (values , action) => {
      try {
        console.log("📡 Sending to:", api.defaults.baseURL + "/users/register");
        await api.post("/users/register" , values)
        toast.success(`${values.fullName} has been registered successfully`);
        
        action.resetForm();
        navigate("/login")
      } catch (error) {
        console.log("Registration succefully..." , error.response)
        console.error("Signup failed:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Signup failed. Please try again.");
      }
    
    }
  })
  return (
    <div className={styles.signUpContainer}>

      <div className={styles.leftContainer}>
        <h1>Create Account</h1>
        <p>Lets create your account...</p>
        <form action="" onSubmit={handleSubmit}>

          <div className={styles.inputFields}>
            <input type="text" placeholder='Full Name' name='fullName' value={values.fullName} onChange={handleChange}  onBlur={handleBlur}/>
            {errors.fullName && touched.fullName &&(<p className={styles.error}>{errors.fullName}</p>)}
          </div>

          <div className={styles.inputFields}>
            <input type="text" placeholder='Username' name='userName' value={values.userName} onChange={handleChange} onBlur={handleBlur} />
            {errors.userName && touched.userName &&(<p className={styles.error}>{errors.userName}</p>)}
          </div>

          <div className={styles.inputFields}>
            <input type="email" placeholder='Email' name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} />
            {errors.email && touched.email &&(<p className={styles.error}>{errors.email}</p>)}
          </div>

          <div className={styles.inputFields}>
            <input type="password" placeholder='Password' name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} />
            {errors.password && touched.password &&(<p className={styles.error}>{errors.password}</p>)}
          </div>

           <div className={styles.inputFields}>
            <input type="text" placeholder='Role' name='role' value={values.role} onChange={handleChange} onBlur={handleBlur} />
            {errors.role && touched.role &&(<p className={styles.error}>{errors.role}</p>)}
          </div>

          <input className={styles.signupBtn} type="submit"  value="SignUp"  />
        </form>
        <p>Already have an account?<Link to="/login">Login</Link></p>
      </div>

      <div className={styles.rightContainer} >
        <img className={styles.userImage} src="User.png" alt="" />
      </div>
    </div>
  )
}

export default SignUp
