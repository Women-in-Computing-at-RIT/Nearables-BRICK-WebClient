import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { orange600, orange800, brown900, grey50, orangeA200 } from 'material-ui/styles/colors';

export default getMuiTheme({
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  palette: {
    primary1Color: orange600,
    primary2Color: orange800,
    accent1Color: orangeA200,
    alternateTextColor: brown900,
    canvasColor: grey50,
  },
});