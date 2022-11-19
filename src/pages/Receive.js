/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import useCurrentUser from '../hooks/useCurrentUser';
import SelectDetail from '../components/pages/Dashboard/SelectDetail';
// sections
import { ListHead, ListToolbar } from '../lib/tabel';
import { setLoading } from '../lib/store/loading';
// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'member.members_name', label: 'ชื่อลูกค้า', alignRight: false },
  { id: 'member.members_phone', label: 'เบอร์โทรศัพท์', alignRight: false },
  { id: 'po_status', label: 'สถานะ', alignRight: false },
  { id: 'po_member_address', label: 'ที่อยู่ลูกค้า', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.member.members_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.member.members_phone.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.po_status.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.po_member_address.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const dispatch = useDispatch();
  const { currentUser, fetcherWithToken } = useCurrentUser();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isOrders, setOrders] = useState([]);
  const [isSelectMenu, setSelectMenu] = useState({});
  const [isOpenDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetcherOrder();
    }
  }, [currentUser]);

  const fetcherOrder = async () => {
    dispatch(setLoading(true));
    const urlOrder = `${process.env.REACT_APP_API_PRODUCT_EXPRESS}/pre_orders/partner/${currentUser._id}`;
    const preOrders = await fetcherWithToken(urlOrder, {
      method: 'GET',
    }).then((json) => {
      const filterStatus = json.data.filter(
        (item) => item.po_status === 'สินค้าถึงสาขาปลายทางแล้ว' || item.po_status === 'ได้รับสินค้าแล้ว'
      );

      return filterStatus;
    });
    const urlMembers = `${process.env.REACT_APP_API_PRODUCT_EXPRESS}/members`;
    const Members = await fetcherWithToken(urlMembers, {
      method: 'GET',
    }).then((json) => json.data);
    const newPreOrders = [];
    preOrders.forEach((element) => {
      const findByMembers = Members.find((item) => item._id === element.po_member_id);
      if (findByMembers) {
        newPreOrders.push({ ...element, member: findByMembers });
      }
    });
    setOrders(newPreOrders);
    dispatch(setLoading(false));
  };

  const handleOpenMenu = (props) => {
    const { event, row } = props;
    setSelectMenu(row);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - isOrders.length) : 0;

  const filteredUsers = applySortFilter(isOrders, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Receive | NBADigitalservice </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            รายการที่ได้รับแล้วทั้งหมด
          </Typography>
        </Stack>

        <Card>
          <ListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ListHead order={order} orderBy={orderBy} headLabel={TABLE_HEAD} onRequestSort={handleRequestSort} />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, member, po_status, po_member_address } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox" />

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {member.members_name}
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{member.members_phone}</TableCell>

                        <TableCell align="left">{po_status}</TableCell>
                        <TableCell align="left">{po_member_address}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleOpenMenu({ event, row })}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setOpen(false);
            setOpenDetail(true);
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          รายละเอียด
        </MenuItem>
      </Popover>
      {isSelectMenu && (
        <SelectDetail isOpenDetail={isOpenDetail} setOpenDetail={setOpenDetail} isSelectMenu={isSelectMenu} />
      )}
    </>
  );
}
