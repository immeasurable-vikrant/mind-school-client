import { fade, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: '#FBFCFC',
    color: 'black',
    boxShadow: '0px 0px 0px 0px',
    position: 'unset'
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  login: {
    color: '#8E44AD',
    border: '1px solid #8E44AD',
    borderRadius: '10px',
    backgroundColor: 'white',
    margin: '5px'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  sectionDesktop: {
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {}
  }
}));