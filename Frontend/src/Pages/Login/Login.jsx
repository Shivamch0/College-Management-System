import React from 'react';
import styles from "./Login.module.css";
import {Formik , useFormik } from "formik"
import {Link, useNavigate} from "react-router-dom"
import { loginSchema } from '../../schemas/loginSchema';

function Login() {

  const navigate = useNavigate();

  const {values , errors , touched , handleChange , handleSubmit} = useFormik({
    initialValues : {
      email : "" ,
      password : ""
    },
    validationSchema : loginSchema,
    onSubmit : (values , action) => {
      action.resetForm();
      navigate("/")
    }
  })
  return (
    <>
    <div className={styles.loginContainer}>
      <div className={styles.leftContainer} >
        <img className={styles.userImage} src="User.png" alt="" />
      </div>

      <div className={styles.rightContainer}>
        <h1>Welcome Back!</h1>
        <p>Please Login to your account...</p>
        <form action="" onSubmit={handleSubmit}>

          <div className={styles.inputFields}>
            <input type="email" placeholder='Email' name='email' value={values.email} onChange={handleChange} />
            {errors.email && touched.email &&(<p className={styles.error}>{errors.email}</p>)}
          </div>

          <div className={styles.inputFields}>
            <input type="password" placeholder='Password' name='password' value={values.password} onChange={handleChange} />
            {errors.password && touched.password &&(<p className={styles.error}>{errors.password}</p>)}
          </div>

          <input className={styles.signupBtn} type="submit"  value="Login"  />
        </form>
        <p>Don't have an account?<Link to="/signup">SignUp</Link></p>
      </div>
    </div>
    </>
  )
}

export default Login
