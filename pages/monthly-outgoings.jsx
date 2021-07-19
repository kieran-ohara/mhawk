import { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import AppFrame from '../components/app-frame';
import Chart from '../components/chart';
import PaymentPlanGrid from '../containers/payment-plan-grid';

const paymentHasEndDate = (params) => params.getValue(params.id, 'end_date') !== null;

const columns = [
  {
    field: 'is_recurring',
    type: 'boolean',
    headerName: 'Is Recurring',
    width: 160,
    valueGetter: (params) => {
      return !paymentHasEndDate(params);
    },
  },
];

const appBarHeight = 64;
const chartHeight = 260;
const chartPadding = 16;
const chartWidth = 400;
const drawerWidth = 240;
const legendHeight = 16;

const useStyles = makeStyles((theme) => ({
  centerMargin: {
    width: `${chartWidth}px`,
    margin: '0 auto',
    padding: `${chartPadding}px`,
  },
  dataGrid: {
    display: 'flex',
    height: `calc(100vh - ${appBarHeight + chartHeight + chartPadding + legendHeight}px)`,
    [theme.breakpoints.up('lg')]: {
      height: `calc(100vh - ${appBarHeight}px)`,
    },
  },
  content: {
    flexGrow: 1,
  },
  aside: {
    width: drawerWidth,
  },
  calendar: {
    display: 'flex',
  },
  calendarMonth: {
    flexGrow: 1,
    textAlign: 'center',
    lineHeight: 3,
  },
}));

export default function MonthlyOutgoings() {
  const classes = useStyles();
  const router = useRouter();
  const apiQueryParams = { payments_for_date: new Date() };

  /* eslint-disable */
  const {
    payments_for_month,
    chart_aggregate = 'true',
    chart_end = '2021-12-31',
    chart_start = '2021-06-01',
  } = router.query;
  /* eslint-enable */

  return (
    <>
      <AppFrame title="Monthly Outgoings">
        <Grid container>
          <Grid item xs={12} lg={6}>
            <div className={classes.centerMargin}>
              <Chart
                width={chartWidth}
                height={chartHeight}
                startDate={new Date(chart_start)}
                endDate={new Date(chart_end)}
                aggregatePaymentType={chart_aggregate}
              />
            </div>
          </Grid>
          <Grid item xs={12} lg={6} className={classes.dataGrid}>
            <div className={classes.content}>
              <PaymentPlanGrid
                apiQueryParams={apiQueryParams}
                columns={columns}
              />
            </div>
          </Grid>
        </Grid>
      </AppFrame>
    </>
  );
}
