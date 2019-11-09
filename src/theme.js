import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgba(246, 81, 29, 1)'
            // main: 'rgba(219, 34, 42, 1)'
        },
        secondary: {
            main: 'rgba(13, 59, 102, 1)'
        }
    },
    status: {
        danger: 'orange',
    },
});

export default theme;