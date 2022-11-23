import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, styled, TextField } from '@mui/material';
import useAuth from 'app/hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: 'center',
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

const ForgotPasswordRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    margin: '1rem',
    borderRadius: 12,
  },
}));

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      const resp = await forgotPassword({ email });
      setLoading(false);
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
    <ForgotPasswordRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={4}>
              <img width="300" src="/assets/images/illustrations/dreamer.svg" alt="" />
            </JustifyBox>

            <ContentBox>
              <form>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  label="Email"
                  value={email}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3, width: '100%' }}
                />

                <LoadingButton
                  onClick={handleFormSubmit}
                  disabled={!email}
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  loading={loading}
                >
                  Send Mail
                </LoadingButton>

                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ mt: 2 }}
                >
                  Go Back
                </Button>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </ForgotPasswordRoot>
  );
};

export default ForgotPassword;
