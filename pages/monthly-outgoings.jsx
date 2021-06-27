import useSWR from 'swr';

import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Link from 'next/link';
import LinearProgress from '@material-ui/core/LinearProgress';

import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { PaymentPlanGrid } from '../components/payment-plan';
import usePaymentPlanMutations from '../hooks/payment-plans';

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

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    height: '100%',
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
  const { payments_for_month } = router.query;

  // LOL
  let paymentsForMonth;
  let dateString;
  let previousMonth;
  let nextMonth;
  try {
    paymentsForMonth = new Date(payments_for_month);
    dateString = toYYYYMMDD(paymentsForMonth);
    previousMonth = new Date(paymentsForMonth.setMonth(paymentsForMonth.getMonth() - 1));
    nextMonth = new Date(paymentsForMonth.setMonth(paymentsForMonth.getMonth() + 2));
    paymentsForMonth.setMonth(paymentsForMonth.getMonth() - 1);
  } catch (error) {
    paymentsForMonth = new Date();
    dateString = toYYYYMMDD(paymentsForMonth);
    previousMonth = new Date(paymentsForMonth.setMonth(paymentsForMonth.getMonth() - 1));
    nextMonth = new Date(paymentsForMonth.setMonth(paymentsForMonth.getMonth() + 2));
    paymentsForMonth.setMonth(paymentsForMonth.getMonth() - 1);
  }

  const options = { month: 'long' };
  const dateLocaleString = paymentsForMonth.toLocaleString('en-GB', options);

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
        <div className={classes.root}>
          <div className={classes.content}>
            <PaymentPlanGrid
              data={data.items}
              columns={columns}
            />
          </div>
          <Hidden xsDown>
            <aside className={classes.aside}>
              <div className={classes.calendar}>
                <Link href={`?payments_for_month=${toYYYYMMDD(previousMonth)}`}>
                  <IconButton aria-label="delete">
                    <NavigateBeforeIcon />
                  </IconButton>
                </Link>
                <Typography variant="subtitle1" noWrap className={classes.calendarMonth}>
                  {dateLocaleString}
                </Typography>
                <Link href={`?payments_for_month=${toYYYYMMDD(nextMonth)}`}>
                  <IconButton aria-label="delete">
                    <NavigateNextIcon />
                  </IconButton>
                </Link>
              </div>
              <Typography>
                {`£${data.gross_month} - £${data.sum} = £${data.net_month}`}
              </Typography>
            </aside>
          </Hidden>
        </div>
      </AppFrame>
    </>
  );
}
