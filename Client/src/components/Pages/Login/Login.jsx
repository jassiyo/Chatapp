import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { NavLink , Link} from 'react-router-dom'; // Import useHistory hook
import styles from './login.module.css'; // Adjust the path as necessary
import LoginIcon from '@mui/icons-material/Login';
import TextField from '@mui/material/TextField';
const Login = () => {
  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = object({
    email: string().email('Invalid email format').required('Required'),
    password: string().min('Password must be at least 6 characters').required('Required')
  });

  const onSubmit = (values) => {
    console.log('Form data', values);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome to our Legal Chatbot</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {formik => (
          <Form className={styles.formContainer}>
            <div className={styles.formGroup}>
              <TextField
                            id="standard-basic" label="Email" variant="standard"

                className={styles.formControl}
                type="email"
                name="email"
                placeholder="Email"
              />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <TextField
              id="standard-basic" label="Password" variant="standard"
                className={styles.formControl}
                style={{color: 'white'}}
                type="password"
                name="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>
            <Link type={'button'} to={'/'}>
            <button type="submit" className={styles.submitButton}><LoginIcon/>Login</button></Link>
            <NavLink type="button" className={styles.registerButton} to={'/register'}>Register</NavLink>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
