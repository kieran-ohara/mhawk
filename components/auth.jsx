import React from 'react';

import { useSession, signIn } from 'next-auth/client';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles({
  container: {
    display: 'table',
    width: '100%',
    height: '100vh',
  },
  content: {
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center',
  },
});

function Auth({ children }) {
  const [session, loading] = useSession();
  const isUser = !!session?.user;

  const classes = useStyles();

  React.useEffect(() => {
    // Do nothing while loading
    if (loading) {
      return;
    }
    // If not authenticated, force log in
    if (!isUser) {
      signIn();
    }
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <CircularProgress />
      </div>
    </div>
  );
}

export default Auth;
