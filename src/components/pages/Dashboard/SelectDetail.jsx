/* eslint-disable react/prop-types */
import React from 'react';
import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
} from '@mui/material';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function SelectDetail(props) {
  const { isOpenDetail, setOpenDetail, isSelectMenu } = props;
  const newDetail = [];
  isSelectMenu?.po_detail?.forEach((element) => {
    console.log(element);
    element.product_select_detail.forEach((element2) => {
      newDetail.push({ product_name: element.product_name.Thai, size: element2.Thai, amount: element2.amount });
    });
  });
  console.log(newDetail);
  const handleClose = () => {
    setOpenDetail(false);
  };

  return (
    <div>
      {' '}
      <Dialog
        fullWidth
        open={isOpenDetail}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'รายละเอียดสินค้าของออเดอร์นี้ '}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อสินค้า (ภาษาไทย)</TableCell>
                    <TableCell align="right">ขนาด</TableCell>
                    <TableCell align="right">จำนวน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newDetail.map((row) => (
                    <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {row.product_name}
                      </TableCell>
                      <TableCell align="right">{row.size}</TableCell>
                      <TableCell align="right">{row.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ออก</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SelectDetail;
