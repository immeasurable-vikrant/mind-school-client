import { fade, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: '#FBFCFC',
    color: 'black',
    boxShadow: '0 4px 12px rgba(0,0,0,.08) ',
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
    },
    fontWeight: 700,
    lineHeight: '24px'
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
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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