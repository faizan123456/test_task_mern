import {
    Box,
    Card,
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
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
        "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
        "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
}));

const LoginHistory = () => {
    const [page, setPage] = useState(0);
    const { getActivities } = useAuth();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        async function activities() {
            const activities = await getActivities();
            // console.log('activities', activities)
            setActivities(activities)
        }
        activities();
    }, [])

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div style={{ margin: 20 }}>
            <h1>Login History</h1>
            <Card style={{ margin: 10 }}>
                {activities.length > 0 ?
                    <Box style={{ margin: 15 }} width="100%" overflow="auto" >
                        < StyledTable >
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Name</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Login Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activities
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((activity, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="left">{activity.user.username}</TableCell>
                                            <TableCell align="center">{activity.user.email}</TableCell>
                                            <TableCell align="center"><span style={{ background: 'lightblue', color: 'navy', borderRadius: 8, padding: 10 }}><ReactTimeAgo date={activity.lastLoginTime} timeStyle="twitter" /> ago</span></TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </StyledTable >

                        <TablePagination
                            sx={{ px: 2 }}
                            page={page}
                            component="div"
                            rowsPerPage={rowsPerPage}
                            count={activities.length}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            nextIconButtonProps={{ "aria-label": "Next Page" }}
                            backIconButtonProps={{ "aria-label": "Previous Page" }}
                        />
                    </Box>
                    : <h1 style={{ textAlign: 'center' }}>Data Not Found</h1>}
            </Card>
        </div >
    );
};

export default LoginHistory;