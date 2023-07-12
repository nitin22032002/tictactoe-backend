import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import "../css/leaderboard.css"
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getRequest } from '../server/server';
const columns = [
    { id: "rank", label: "Rank" },
    { id: "user_name", label: "User Name" },
    { id: "emailid", label: "Email Id" },
    { id: "score", label: "Score" },
    { id: "match", label: "Match Play" },
]

export default function Leaderboard() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [fetchData,setFetchData]=React.useState([])
    const [data,setData]=React.useState([])
    const history=useHistory()

    const loadData=async()=>{
        try{
            let res=await getRequest("/leaderboard");
            if(res.status){
                setFetchData(res.data);
                setData(res.data);
            }
            else{
                alert(res.error);
                history.replace({pathname:"/"})
            }
        }catch(e){
            alert("Server Error...")
            history.replace({pathname:"/"})
        }
    }
    useEffect(()=>{
        loadData();
    },[])
    const handleSearch=(msg)=>{
        let pattern=msg;
        if(pattern===""){
            setData(fetchData);
        }
        else{
            let arr=fetchData.filter((item)=>{
                return (String(item.emailid).startsWith(pattern));
            })
            setData(arr);
        }
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className='leader-board-div'>
            <div className='leader-board-sub-div'>
                <div className='leader-board-search-bar'>
                    <div class="search-bar">
                        <img src="/tictactoe.png" alt="Website Logo" class="logo" />
                        <input type="text" onChange={(event)=>{handleSearch(event.currentTarget.value)}} class="search-input" placeholder="Search By Email..." />
                        <SearchIcon />
                    </div>
                </div>
                <div className='leader-board-table'>
                    <TableContainer style={{maxHeight:440}}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead >
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align="center"
                                            style={{minWidth: 170 }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell  key={column.id} align="center">
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </div>
        </div>
    )
}
