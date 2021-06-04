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
import { PaymentPlan } from '../components/payment-plan';

const getIsRecurringPayment = (params) => params.getValue(params.id, 'end_date') !== null;

const columns = [
  {
    field: 'payments_count',
    type: 'number',
    headerName: 'Payments Made',
    width: 180,
  },
  {
    field: 'is_recurring',
    type: 'boolean',
    headerName: 'Is Recurring',
    width: 160,
    valueGetter: getIsRecurringPayment,
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

export default function Home() {
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

  const { data } = useSWR(
    `/api/v0/monthly-outgoings?date=${dateString}`,
    (req) => fetch(req).then((res) => res.json()),
  );

  if (!data) {
    return (
      <>
        <LinearProgress />
      </>
    );
  }

  return (
    <>
      <div className={classes.root}>
        <div className={classes.content}>
          <PaymentPlan
            dataURI={`/api/v0/payment-plans?payments_for_month=${dateString}`}
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
    </>
  );
}
