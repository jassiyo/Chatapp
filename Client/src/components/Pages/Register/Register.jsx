import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { NavLink } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const initialValues = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = object({
    email: string().email('Invalid email format').required('Required'),
    password: string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: string().required('Required')
  });

  const onSubmit = (values) => {
    console.log('Form data', values);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Register</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {formik => (
          <Form className={styles.formContainer}>
            <div className={styles.formGroup}>
              <Field
                className={styles.formControl}
                type="email"
                name="email"
                placeholder="Email"
              />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <Field
                className={styles.formControl}
                type="password"
                name="password"
                placeholder="Password"
              />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <Field
                className={styles.formControl}
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
              />
              <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
            </div>

            <button type="submit" className={styles.submitButton}>Register</button>
            <NavLink type="button" className={styles.registerButton} to={'/login'}>Back to Login</NavLink>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
