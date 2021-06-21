import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

const FabContainer = (props) => {
  const { children } = props;
  const classes = useStyles();
  return (

    <div className={classes.root}>
      {children}
    </div>
  );
};

export default FabContainer;
