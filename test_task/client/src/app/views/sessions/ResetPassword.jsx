import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import * as Yup from 'yup';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100% !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
}));

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
});

const ResetPassword = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const userId = params.get('userId');
  // console.log('userId', userId);
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { resetPassword } = useAuth();

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      const obj = { password, confirmPassword, userId };
      const resp = await resetPassword(obj);
      if (resp.success) {
        toast(resp.message, {
          type: 'success',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        toast(resp.message, {
          type: 'error',
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
      setTimeout(() => {
        navigate('/signin');
      }, 5000);
    } catch (err) {
      setLoading(false);
      toast(err.message, {
        type: 'error',
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              {/* <Formik
                onSubmit={handleFormSubmit}
                // initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => ( */}
              <form>
                <TextField
                  fullWidth
                  size="small"
                  type="password"
                  name="password"
                  label="New Password"
                  variant="outlined"
                  // onBlur={handleBlur}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  size="small"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  // onBlur={handleBlur}
                  // helperText={touched.password && errors.password}
                  // error={Boolean(errors.password && touched.password)}
                  sx={{ mb: 1.5 }}
                />
                {password !== confirmPassword && confirmPassword && (
                  <small style={{ color: 'red' }}>
                    Confirm password doesn't match with password
                  </small>
                )}
                <LoadingButton
                  disabled={!password || !confirmPassword || password !== confirmPassword}
                  onClick={handleFormSubmit}
                  type="submit"
                  color="primary"
                  loading={loading}
                  variant="contained"
                  sx={{ my: 2 }}
                >
                  Reset Password
                </LoadingButton>
              </form>
              {/* )}
              </Formik> */}
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};

export default ResetPassword;
