import useSWR from 'swr';

import LinearProgress from '@material-ui/core/LinearProgress';

import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import Grid from '@material-ui/core/Grid';
import { PaymentPlanGrid } from '../components/payment-plan';
import usePaymentPlanMutations from '../hooks/payment-plans';
import Chart from '../components/chart';

import AppFrame from '../components/app-frame';

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

const drawerWidth = 240;
const chartHeight = 260;
const chartWidth = 400;
const appBarHeight = 64;

const useStyles = makeStyles((theme) => ({
  centerMargin: {
    width: `${chartWidth}px`,
    margin: '0 auto',
    padding: '16px',
  },
  dataGrid: {
    display: 'flex',
    height: `calc(100vh - ${appBarHeight + chartHeight}px)`,
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

function toYYYYMMDD(date) {
  return date.toISOString().split('T')[0];
}

export default function MonthlyOutgoings() {
  const classes = useStyles();
  const router = useRouter();
  // eslint-disable-next-line
  const {
    payments_for_month,
    chart_aggregate = 'true',
    chart_end = '2021-12-31',
    chart_start = '2021-06-01',
  } = router.query;

  // LOL
  let paymentsForMonth;
  let dateString;
  try {
    paymentsForMonth = new Date(payments_for_month);
    dateString = toYYYYMMDD(paymentsForMonth);
    paymentsForMonth.setMonth(paymentsForMonth.getMonth() - 1);
  } catch (error) {
    paymentsForMonth = new Date();
    dateString = toYYYYMMDD(paymentsForMonth);
    paymentsForMonth.setMonth(paymentsForMonth.getMonth() - 1);
  }

  const { getActiveMutationsForDate } = usePaymentPlanMutations();

  const { data, error } = useSWR(
    `/api/v0/monthly-outgoings?date=${dateString}`,
    (req) => {
      return Promise.all([
        fetch(req),
        getActiveMutationsForDate(paymentsForMonth),
      ]).then(async (res) => {
        const [fetchResult, mutations] = res;
        const fetchJson = await fetchResult.json();
        fetchJson.items = fetchJson.items.concat(mutations.create);

        const sumMutations = mutations.create.reduce((acc, mutation) => {
          return acc + parseFloat(mutation.monthly_price);
        }, 0);

        fetchJson.sum = parseFloat(fetchJson.sum) + sumMutations;
        return fetchJson;
      });
    },
  );

  if (error) {
    return (
      <>
        <p>{error}</p>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <LinearProgress />
      </>
    );
  }

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
                data={data.items}
                columns={columns}
              />
            </div>
          </Grid>
        </Grid>
      </AppFrame>
    </>
  );
}
