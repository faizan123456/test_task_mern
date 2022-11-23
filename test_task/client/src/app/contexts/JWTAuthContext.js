import React, { createContext, useEffect, useReducer } from 'react'
import jwtDecode from 'jwt-decode'
import axios from 'axios.js'
import { MatxLoading } from 'app/components'
const baseUrl = process.env.REACT_APP_BASE_URL;
const endPoint = baseUrl + '/user';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
    users: [],
    activities: [],
    user: null,
    createdUser: null,
    updatedUser: null,
    deleted: false
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }
    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        // delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user
            }
        }
        case 'ALL_USERS': {
            const { users } = action.payload
            return {
                ...state,
                users,
            }
        } case 'ACTIVTIES': {
            const { activities } = action.payload
            return {
                ...state,
                activities,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'DELETE': {
            return {
                ...state,
                deleted: true
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                createdUser: user,
            }
        } case 'UDATED': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                updatedUser: user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
    forgotPassword: () => { },
    resetPassword: () => { },
    fetchAllUsers: () => { },
    getActivities: () => { },
    deleteUser: () => Promise.resolve(),
    updateUser: () => Promise.resolve(),
    updatePassword: () => Promise.resolve(),
    getUser: () => { }
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const login = async (data) => {
        const response = await axios.post(`${endPoint}/login`, data);
        const { token, user } = response.data.data;
        setSession(token)
        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        })
    }

    const register = async (data) => {
        const response = await axios.post(`${endPoint}/register`, data)
        const { token, user } = response.data

        setSession(token)

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
            }
        })
    }

    const updateUser = async (data) => {
        let token = window.localStorage.getItem('accessToken');
        const response = await axios.put(`${endPoint}/updateUser`, data, {
            headers: { 'x-auth-token': token }
        })
        const { success, message, user } = response.data;

        dispatch({
            type: 'UPDATE_USER',
            payload: {
                user,
            }
        })
        return { success, message, user }
    }

    const forgotPassword = async (data) => {
        const response = await axios.post(`${endPoint}/forgot-password`, data)
        const { userId, success, message } = response.data;
        return { userId, success, message };
    }

    const fetchAllUsers = async () => {
        const response = await axios.get(`${endPoint}`)
        const { users, message } = response.data;
        dispatch({
            type: 'ALL_USERS',
            payload: {
                users,
            },
        })
        return users;
    }
    const getActivities = async () => {
        const response = await axios.get(`${endPoint}/activities`)
        const { activities, message } = response.data;
        dispatch({
            type: 'ACTIVITIES',
            payload: {
                activities,
            },
        })
        return activities;
    }

    const resetPassword = async (data) => {
        const response = await axios.post(`${endPoint}/reset-password`, data)
        const { userId, success, message } = response.data;
        return { userId, success, message };
    }

    const updatePassword = async (data) => {
        const response = await axios.post(`${endPoint}/update-password`, data)
        const { userId, success, message } = response.data;
        return { userId, success, message };
    }

    const deleteUser = async (data) => {
        let token = window.localStorage.getItem('accessToken');
        console.log('token', token)
        const response = await axios.post(`${endPoint}/delete`, data, {
            headers: {
                'x-auth-token': token
            }
        })
        const { userId, success, message } = response.data;
        dispatch({ type: 'DELETE' })
        return { userId, success, message };
    }

    const logout = () => {
        setSession(null)
        dispatch({ type: 'LOGOUT' })
    }
    const getUser = async (userId) => {
        const response = await axios.post(`${endPoint}/singleUser`, userId)
        const { user } = response.data;
        return user
    }

    useEffect(() => {
        (async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const user = jwtDecode(accessToken);
                console.log('user decrypt', user);
                const userId = user.id
                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken)
                    const response = await axios.post(`${endPoint}/singleUser`, userId)
                    const { user } = response.data

                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    })
                } else {
                    dispatch({
                        type: 'INIT',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    })
                }
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, [])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
                forgotPassword,
                resetPassword,
                fetchAllUsers,
                getActivities,
                deleteUser,
                updateUser,
                updatePassword,
                getUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
