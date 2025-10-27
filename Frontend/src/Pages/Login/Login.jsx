import React , { useContext } from 'react';
import styles from "./Login.module.css";
import {Formik , useFormik } from "formik"
import {Link, useNavigate} from "react-router-dom"
import { loginSchema } from '../../schemas/loginSchema';
import { api } from '../../api/axios.js';
import { UserContext } from "../../Context/userContext.js";
import toast from "react-hot-toast";

function Login() {

  const navigate = useNavigate();
  const {login} = useContext(UserContext);

  const {values , errors , touched , handleChange , handleSubmit} = useFormik({
    initialValues : {
      email : "" ,
      password : ""
    },
    validationSchema : loginSchema,
    onSubmit : async (values , action) => {
      try {
        const response = await api.post("/users/login" , values , {withCredentials : true});
        const user = response.data.data.user;
        login(user)
        toast.success(`${user.fullName} LoggedIn Successfully...`);

        action.resetForm();
        if(user.role === "admin"){
          navigate("/admin/dashboard");
        }else if(user.role === "student"){
          navigate("/events");
        }else if(user.role === "organizer"){
          navigate("/events");
        }else{
          navigate("/")
        }
      } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        alert(error.response?.data?.data?.message || "Login failed. Please try again.");
      }
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
