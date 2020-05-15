import { createMuiTheme } from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import sec from "@material-ui/core/colors/blueGrey";

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: sec
    }
});

export default theme;