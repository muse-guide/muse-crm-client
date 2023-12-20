import * as React from 'react';
import Table, {TableProps} from '@mui/material/Table';
import TableCell, {TableCellProps} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow, {TableRowProps} from '@mui/material/TableRow';
import {BasePanel} from "./panel";
import {grey} from "@mui/material/colors";

export const BaseTable = ({children, ...props}: TableProps) => {
    return (
        <TableContainer component={BasePanel}>
            <Table sx={{minWidth: 650, width: '100%', flexGrow: 1}} {...props}>
                {children}
            </Table>
        </TableContainer>
    )
}

export const TableHeadCell = ({children, ...props}: TableCellProps) => {
    return (
        <TableCell sx={{backgroundColor: grey[100], fontWeight: "bolder"}} {...props}>
            {children}
        </TableCell>
    )
}

export const BaseTableRow = ({children, ...props}: TableRowProps) => {
    return (
        <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
            {...props}
        >
            {children}
        </TableRow>
    )
}
