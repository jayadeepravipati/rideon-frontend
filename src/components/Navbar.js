import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Bike Rental
        </Typography>
        <Button color="inherit">Login</Button>
        <Button color="inherit">Register</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
