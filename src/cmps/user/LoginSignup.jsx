import { useState, useEffect, Fragment } from "react"

// Formik
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'

//material-ui
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import FormHelperText from '@mui/material/FormHelperText'
import { createTheme, ThemeProvider } from "@mui/material/styles"

// services
import { userService } from "../../services/user/index-user.js"
import { getUiTheme } from "../../services/util.service.js";


export function LoginSignup({ isPopupOpen, signup, login, toggleIsSignup, isSignup, isMiniLoading }) {

    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }


    function onSubmit(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }

    const SignupSchema = Yup.object().shape({
        username: Yup.string()
            .min(2, 'Too Short!')
            .max(20, 'Too Long!')
            .required('Required'),
        password: Yup.string()
            .min(3, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        fullname: Yup.string().when([], {
            is: () => isSignup,
            then: (schema) =>
                schema.min(2, 'Too Short!')
                    .max(20, 'Too Long!')
                    .required('Required'),
            otherwise: (schema) => schema.notRequired()
        }),
    })

    const theme = createTheme(getUiTheme())

    return (
        <div className="login-signup">
            <ThemeProvider theme={theme}>
                <Formik
                    initialValues={{ ...credentials }}
                    enableReinitialize={true}
                    validationSchema={SignupSchema}
                    onSubmit={values => onSubmit(values)}
                >
                    {({ errors, touched, resetForm }) => {

                        useEffect(() => {
                            if (!isPopupOpen) {
                                resetForm({ values: userService.getEmptyCredentials() })

                                if (isSignup) {
                                    setTimeout(() => {
                                        toggleIsSignup()
                                    }, 200)
                                }

                                setCredentials(userService.getEmptyCredentials())
                            }
                        }, [isPopupOpen, isSignup, toggleIsSignup, resetForm])

                        return (
                            <Form>

                                <Field
                                    as={TextField}
                                    name="username"
                                    label="Username"
                                    variant="outlined"
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={touched.username && errors.username}
                                />



                                <Field name="password">
                                    {({ field }) => (
                                        <FormControl
                                            variant="outlined"
                                            fullWidth
                                            error={touched.password && Boolean(errors.password)}
                                        >
                                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                            <OutlinedInput
                                                {...field}
                                                id="outlined-adornment-password"
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                            />
                                            {touched.password && errors.password && (
                                                <FormHelperText>{errors.password}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                </Field>


                                {isSignup &&
                                    <Fragment>
                                        <Field
                                            as={TextField}
                                            name="fullname"
                                            id="fullname"
                                            label="Full Name"
                                            variant="outlined"
                                            error={touched.fullname && Boolean(errors.fullname)}
                                            helperText={touched.fullname && errors.fullname}
                                        />
                                    </Fragment>
                                }

                                <button
                                    type="submit"
                                    className={`t-a ${isSignup ? 'signup' : 'login'}`}
                                >
                                    {isMiniLoading
                                        ? <div className="mini-loader"></div>
                                        : (isSignup ? 'Signup' : 'Login')
                                    }

                                </button>

                            </Form>)
                    }}
                </Formik>
            </ThemeProvider>

            <div className='signup-msg-toggle' >
                <div onClick={toggleIsSignup}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </div >
            </div>

        </div >
    )
}
