import { useState } from 'react';
import { useRouter } from 'next/router';

import { format, addMonths, subMonths } from 'date-fns';

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

  const now = new Date();
  const monthsEitherSide = 5;

  const {
    chart_aggregate: qChartAggregate = 'true',
    chart_end: qChartEnd = format(addMonths(now, monthsEitherSide), 'yyyy-MM-dd'),
    chart_start: qChartStart = format(subMonths(now, monthsEitherSide), 'yyyy-MM-dd'),
    payments_for_month: qPointInTime = format(now, 'yyyy-MM-dd'),
  } = router.query;

  const [chartAggregate] = useState(qChartAggregate);
  const [chartStart] = useState(new Date(qChartStart));
  const [chartEnd] = useState(new Date(qChartEnd));
  const [pointInTime] = useState(new Date(qPointInTime));

  const apiQueryParams = { payments_for_date: pointInTime };

  return (
    <>
      <AppFrame title="Monthly Outgoings">
        <Grid container>
          <Grid item xs={12} lg={6}>
            <div className={classes.centerMargin}>
              <Chart
                width={chartWidth}
                height={chartHeight}
                startDate={new Date(chartStart)}
                endDate={new Date(chartEnd)}
                aggregatePaymentType={chartAggregate}
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
