import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import jsPdf from 'jspdf';
import { useLocation } from 'react-router-dom';
import autoTable from 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';
import { useGetSalesReportQuery } from '../../redux/api/adminApiSlice';
import AdminSalesTableList from '../../components/admin/Table/AdminSalesTableList';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import NoResultsFound from '../../components/NoResultsFound';
import SalesFilter from '../../components/admin/Filters/SalesFilter';

function AdminSalesReportPage() {
  const { search } = useLocation();
  const [resData, setResData] = useState([]);
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetSalesReportQuery(search);
  let content;
  const handleError = useApiErrorHandler();

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);

  useEffect(() => {
    if (isSuccess) {
      if (data.data) {
        setResData(() => [...data.data]);
      } else {
        setResData([]);
      }
    }
  }, [data, isSuccess]);

  if (isLoading || isFetching) {
    content = (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowY: 'hidden',
          display: 'flex',
          backgroundColor: 'rgba(0,0,0,0.1)',
          alignItems: 'center',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <CircularProgress
          sx={{ overflow: 'hidden' }}
          color="primary"
        />
      </Box>
    );
  }

  const handleReportDownloadExcel = () => {
    if (data?.data) {
      const reportData = data.data.map((order) => ({
        'Order Id': order.orderId,
        'Order Amount': order.totalAmountDiscounted,
        'Payment Method': order.paymentMethod,
        'Delivery Date': new Date(order.orderStatusUpdatedOn).toLocaleDateString('en-us')
      }));
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'MySheet1');

      XLSX.writeFile(wb, `SalesReport ${new Date().toLocaleString()}.xlsx`);
    }
  };

  const handleReportDownloadPdf = () => {
    if (data?.data) {
      // eslint-disable-next-line new-cap
      const doc = new jsPdf();
      const width = doc.internal.pageSize.getWidth();
      doc.text('Sales Report', width / 2, 10, { align: 'center' });
      autoTable(doc, {
        theme: 'grid',
        head: [['OrderId', 'Order Amount', 'Payment Method', 'Delivery Date']],
        body: data.data.map((order) => [
          order.orderId,
          order.totalAmountDiscounted.toLocaleString('en-IN'),
          order.paymentMethod,
          new Date(order.orderStatusUpdatedOn).toLocaleDateString('en-us')
        ])
      });
      doc.save(`SalesReport ${new Date().toLocaleString()}.pdf`);
    }
  };

  return (
    <Box sx={{ overflowX: 'hidden', pt: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: '1rem', textAlign: 'center', fontWeight: '450' }}
      >
        SALES REPORT
      </Typography>
      {content}
      {isSuccess && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <SalesFilter />
            {resData.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: 2
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleReportDownloadExcel}
                  sx={{ mr: { xs: 3, md: 25 }, minWidth: 230, backgroundColor: '#fff' }}
                >
                  Download Report Excel
                  <DownloadIcon />
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReportDownloadPdf}
                  sx={{ minWidth: 230, mr: { xs: 3, md: 25 }, backgroundColor: '#fff' }}
                >
                  Download Report Pdf
                  <DownloadIcon />
                </Button>
              </Box>
            )}
          </Box>
          {!resData.length && <NoResultsFound />}
        </>
      )}

      {isSuccess && resData.length > 0 && <AdminSalesTableList data={resData} />}
    </Box>
  );
}

export default AdminSalesReportPage;
