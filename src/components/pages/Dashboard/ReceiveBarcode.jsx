/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

export default function FormDialog(props) {
  const { isOrders, dispatch, setLoading, fetcherOrder, fetcherWithToken, currentUser } = props;
  const [open, setOpen] = React.useState(false);
  const [isERROR, setERROR] = React.useState(false);
  const [isBarcode, setBarcode] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const findValue = isOrders.find((item) => item._id === isBarcode);
    if (findValue) {
      dispatch(setLoading(true));
      setOpen(false);
      const url = `${process.env.REACT_APP_API_PRODUCT_EXPRESS}/pre_orders/${findValue._id}`;
      const timestamp = findValue.po_timestamp;
      timestamp.push({
        name: 'สินค้าถึงสาขาปลายทางแล้ว',
        marklist: currentUser.partner_name,
        timestamp: dayjs(Date.now()).format(),
      });
      await fetcherWithToken(url, {
        method: 'PUT',
        body: JSON.stringify({ po_timestamp: timestamp, po_status: 'สินค้าถึงสาขาปลายทางแล้ว' }),
      })
        .then(() => {
          dispatch(setLoading(false));
          Swal.fire({
            icon: 'success',
            title: 'ยืนยันการทำรายการ',
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(async () => {
            await fetcherOrder();
            setOpen(true);
          }, 1500);
        })
        .catch(() => {
          dispatch(setLoading(false));
          setERROR(true);
          setTimeout(() => {
            setOpen(true);
            setERROR(false);
          }, 2500);
        });
    } else {
      setERROR(true);
      setTimeout(() => {
        setERROR(false);
      }, 2500);
    }
    setBarcode('');
    event.preventDefault();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        กรอกเลขบาร์โค้ต
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>กรอกเลขบาร์โค้ต ที่อยู่ในใบคำสั่งซื้อ (อย่าลืมเปลี่ยนภาษา)</DialogTitle>
        {isERROR && (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">รหัสบาร์โค้ตผิดหรือ — คุณไม่มีสิทธิรับสินค้านี้!</Alert>
          </Stack>
        )}

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Input
              value={isBarcode}
              autoFocus
              margin="dense"
              id="name"
              label="Barcode"
              fullWidth
              variant="standard"
              onChange={(e) => setBarcode(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            ออก
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
