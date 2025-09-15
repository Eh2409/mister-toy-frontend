import { useState } from "react";
import { useSelector } from "react-redux"

// Formik
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'

//material-ui
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider } from "@mui/material/styles"

// services
import { userActions } from "../../../store/actions/user.actions.js";
import { getUiTheme } from "../../services/util.service";
import { ImageUploader } from "../ImageUploader";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service.js";



export function UserSettings(props) {

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const [credentials, setCredentials] = useState({ _id: loggedinUser?._id, imgUrl: '' })
    const [isMiniLoading, setIsMiniLoading] = useState({ isLoading: false, type: '' })
    const theme = createTheme(getUiTheme())


    const SignupSchema = Yup.object().shape({
        username: Yup.string()
            .min(2, 'Too Short!')
            .max(20, 'Too Long!')
            .required('Required'),
    })

    function setUserImg(newUserImg) {
        setCredentials(prev => ({ ...prev, imgUrl: newUserImg }))
    }

    async function onUpdateUser(userToUpdate) {
        setIsMiniLoading({ isLoading: true, type: userToUpdate?.username ? 'username' : 'imgUrl' })

        try {
            await userActions.update(userToUpdate)
            const msg = `${userToUpdate?.username ? 'Username' : 'User Image'} successfully saved!`
            showSuccessMsg(msg)
            return true
        } catch (err) {
            console.log('err:', err)
            const msg = `Failed to save ${userToUpdate?.username ? 'Username' : 'User Image'}`
            showErrorMsg(msg)
        } finally {
            setIsMiniLoading({ isLoading: false, type: '' })
        }
    }

    return (
        <section className="user-settings">

            <h2>My Settings</h2>

            <div className="username-update">

                <h3>Change Your Username</h3>

                <ThemeProvider theme={theme}>
                    <Formik
                        initialValues={{ _id: loggedinUser?._id, username: '' }}
                        enableReinitialize={true}
                        validationSchema={SignupSchema}
                        onSubmit={async (values, { resetForm }) => {
                            const success = await onUpdateUser(values)
                            if (success) resetForm()
                        }}
                    >
                        {({ errors, touched }) => {
                            return <Form>

                                <Field
                                    as={TextField}
                                    name="username"
                                    label="Change Username"
                                    variant="outlined"
                                />

                                <button
                                    type="submit"
                                    className="t-a"
                                >
                                    {isMiniLoading.isLoading && isMiniLoading.type === 'username'
                                        ? <div className="mini-loader"></div>
                                        : "save"
                                    }

                                </button>

                                {errors.username && touched.username ?
                                    <div className="error-username">{errors.username}</div> : null}


                            </Form>
                        }}
                    </Formik>
                </ThemeProvider>

            </div>

            <div className="user-img-update">

                <h3>Change Your User Image</h3>

                <ImageUploader onSaveImage={setUserImg} currImage={loggedinUser.imgUrl} />
                <button
                    className="t-a save-btn"
                    disabled={!credentials.imgUrl || credentials.imgUrl === loggedinUser?.imgUrl}
                    onClick={() => onUpdateUser(credentials)}
                >
                    {isMiniLoading.isLoading && isMiniLoading.type === 'imgUrl'
                        ? <div className="mini-loader"></div>
                        : "save"
                    }
                </button>
            </div>

        </section >
    )
}