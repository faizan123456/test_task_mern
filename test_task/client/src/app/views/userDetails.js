import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Icon,
    Radio,
    RadioGroup,
    styled,
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Span } from "app/components/Typography";
import useAuth from "app/hooks/useAuth";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const UserDetails = () => {
    const { getUser, updateUser } = useAuth()
    const params = useParams();
    const userId = params.id;

    // const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();

    useEffect(() => {
        async function user() {
            const user = await getUser({ userId });
            setUsername(user.username);
            setEmail(user.email)
            setPhone(user.phone)
        }
        user();
    }, [userId]);

    const handleSubmit = async (event) => {
        setLoading(true);
        try {
            const obj = { userId, username, email, password, phone };
            const resp = await updateUser(obj);
            if (resp.success) {
                setUsername(resp.user.username);
                setEmail(resp.user.email)
                setPhone(resp.user.phone)
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
            setLoading(false);
        } catch (err) {
            console.log(err);
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
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>User Details</h1>
            <div style={{ padding: 10 }}>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <label>Username</label>
                            <TextField
                                type="text"
                                name="username"
                                // id="standard-basic"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                errorMessages={["this field is required"]}
                                validators={["required", "minStringLength: 4"]}
                            />
                            <label>Email Address</label>
                            <TextField
                                type="email"
                                name="email"
                                // label="Email"
                                // id="standard-basic"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                validators={["required", "isEmail"]}
                                errorMessages={["this field is required", "email is not valid"]}
                            />
                            <label>Phone Number</label>
                            <TextField
                                type="text"
                                name="phone"
                                value={phone}
                                // label="Phone Nubmer"
                                // id="standard-basic"
                                onChange={(e) => setPhone(e.target.value)}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
                            <FormControlLabel
                                control={<Checkbox />}
                                label="I have read and agree to the terms of service."
                            />
                        </Grid>

                    </Grid>

                    <LoadingButton loading={loading} color="primary" variant="contained" type="submit">
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Update User</Span>
                    </LoadingButton>
                </ValidatorForm>
            </div>
        </div >
    );
};

export default UserDetails;