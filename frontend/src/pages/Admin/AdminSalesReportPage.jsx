import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useGetSalesReportQuery } from '../../redux/api/adminApiSlice';
import AdminSalesTableList from '../../components/admin/Table/AdminSalesTableList';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import NoResultsFound from '../../components/NoResultsFound';

function AdminSalesReportPage() {
  const { data, isLoading, isFetching, isSuccess, isError, error } = useGetSalesReportQuery();
  let content;
  const handleError = useApiErrorHandler();
  if (isLoading || (isFetching && !isSuccess)) {
    content = (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          overflowY: 'hidden',
          display: 'flex',
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

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error, handleError]);

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
      autoTable(doc, { theme: 'grid', html: '#salesreportable' });
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
      {!!(isSuccess && data?.data?.length) || <NoResultsFound />}

      {isSuccess && data?.data?.length > 0 && (
        <>
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
            </Button>
            <Button
              variant="outlined"
              onClick={handleReportDownloadPdf}
              sx={{ minWidth: 230, mr: { xs: 3, md: 25 }, backgroundColor: '#fff' }}
            >
              Download Report Pdf
            </Button>
          </Box>
          <AdminSalesTableList data={data?.data} />
        </>
      )}
    </Box>
  );
}

export default AdminSalesReportPage;
