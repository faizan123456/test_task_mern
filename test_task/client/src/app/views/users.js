import {
    Box,
    Icon,
    IconButton,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import useAuth from "app/hooks/useAuth";
import { useEffect } from "react";
import { useState } from "react";
import { ConfirmationDialog } from "app/components";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
}));

const Users = () => {
    const dispatch = useDispatch()
    // const props = useSelector(state => state.users);
    // console.log('props', props)
    const [page, setPage] = useState(0);
    const { fetchAllUsers, deleteUser, user, users, updatedUser, createdUser } = useAuth();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [allUsers, setUsers] = useState(users);
    const [show, setShow] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        async function users() {
            const users = await fetchAllUsers();
            // console.log('users', users)
            setUsers(users)
        }
        users();
    }, []);
    // useEffect(() => {
    //     dispatch(fetchAllUsers());
    // }, [dispatch]);


    const handleDeleteUser = async (userId) => {
        try {
            const resp = await deleteUser({ userId });
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
    }

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div style={{ margin: 20 }}>
            <h1>Users List</h1>
            <div className="container">
                {users.length > 0 ?
                    <Box width="100%" overflow="auto">
                        < StyledTable >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Name</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Phone</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">{user.username}</TableCell>
                                            <TableCell align="center">{user.email}</TableCell>
                                            <TableCell align="center">{user.phone}</TableCell>
                                            <TableCell align="right">
                                                <Link to={`/user/${user._id}`}>
                                                    <IconButton>
                                                        <Icon color="warning">edit</Icon>
                                                    </IconButton>
                                                </Link>
                                                <IconButton onClick={() => handleDeleteUser(user._id)}>
                                                    <Icon color="error">close</Icon>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </StyledTable>
                        {/* <Modal open={isOpen} onClose={!isOpen}>
                            <h3>Delete User</h3>
                        </Modal> */}
                        {/* <ConfirmationDialog open={isOpen} setIsOpen={setIsOpen} /> */}
                        <TablePagination
                            sx={{ px: 2 }}
                            page={page}
                            component="div"
                            rowsPerPage={rowsPerPage}
                            count={allUsers.length}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            nextIconButtonProps={{ "aria-label": "Next Page" }}
                            backIconButtonProps={{ "aria-label": "Previous Page" }}
                        />
                    </Box>
                    : <h1 style={{ textAlign: 'center' }}>Users Not Found</h1>}
            </div>
            {/* <Modal style={{ zIndex: 9999 }} show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you Sure, You  want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </div >
    );
};

export default Users;