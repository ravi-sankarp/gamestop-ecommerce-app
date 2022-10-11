/* eslint-disable operator-linebreak */
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import DoughnutChart from '../../components/admin/Charts/DoughnutChart';
import LineChart from '../../components/admin/Charts/LineChart';
import DashboardCard from '../../components/admin/DashboardCard';
import HelmetMeta from '../../components/HelmetMeta';
import useApiErrorHandler from '../../hooks/useApiErrorHandler';
import {
  useGetDashboardCardDataQuery,
  useGetDashboardGraphDataQuery
} from '../../redux/api/adminApiSlice';

function AdminDashboardPage() {
  const { data, isFetching, isLoading, isSuccess, isError, error } = useGetDashboardCardDataQuery();
  const {
    data: graphData,
    isFetching: isFetchingGraph,
    isLoading: isLoadingGraph,
    isSuccess: isSuccessGraph,
    isError: isErrorGraph,
    error: errorGraph
  } = useGetDashboardGraphDataQuery();
  const handleError = useApiErrorHandler();
  useEffect(() => {
    if (isErrorGraph) {
      handleError(error);
    }
    if (isError) {
      handleError(errorGraph);
    }
  }, [isError, error, handleError, isErrorGraph, errorGraph]);
  if (
    isLoading ||
    (isFetching && !isSuccess) ||
    isLoadingGraph ||
    (isFetchingGraph && !isSuccessGraph)
  ) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,0%)',
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

  return (
    <>
      <HelmetMeta title="Shopping Cart | Gamestop" />
      {isSuccess && (
        <Box sx={{ p: 1, pt: 4, pb: 6 }}>
          <Typography
            textAlign="center"
            variant="h5"
          >
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', mt: 3, mb: 3, justifyContent: 'space-between' }}>
            <DashboardCard
              title="Total Revenue"
              value={`₹ ${data.data.totalAmount.toLocaleString()}`}
            />
            <DashboardCard
              title="Customers"
              value={data.data.totalUsers}
            />
            <DashboardCard
              title="Products"
              value={data.data.totalProducts}
            />
            <DashboardCard
              title="Orders"
              value={data.data.totalOrders}
            />
          </Box>
          <Grid
            container
            spacing={2}
            justifyContent="space-around"
          >
            <Grid
              item
              xs={12}
              md={5}
            >
              <Box
                sx={{
                  minHeight: 400,
                  maxHeight: 400,
                  mt: 2,
                  backgroundColor: '#fff',
                  pb: 4,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography
                  textAlign="center"
                  sx={{ mb: 1, p: 2, backgroundColor: '#f8f9fc' }}
                >
                  Preferred Payment Method
                </Typography>
                <Box sx={{ p: 2, flexGrow: 1 }}>
                  <DoughnutChart graphData={graphData.data[0]} />
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
            >
              <Box
                sx={{
                  minHeight: 400,
                  mt: 2,
                  pb: 4,
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography
                  textAlign="center"
                  sx={{ mb: 1, p: 2, backgroundColor: '#f8f9fc', flexGrow: 0 }}
                >
                  Weekly Orders
                </Typography>
                <Box sx={{ p: 2, flexGrow: 1 }}>
                  <LineChart graphData={graphData.data[1]} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default AdminDashboardPage;
