import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import PeopleIcon from '@material-ui/icons/People';
import MapIcon from '@material-ui/icons/Map';
import { Link } from "react-router-dom";

import './Drawer.css'

export default class SwipeableTemporaryDrawer extends React.Component {
  render() {
    const { toggleDrawer, open } = this.props
    const sideList = (
      <div className="Drawer">
        <List component="nav">
        <Link to={`${process.env.PUBLIC_URL}/`}>
          <ListItem button>
            <ListItemIcon>
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link to={`${process.env.PUBLIC_URL}/sobre`}>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Sobre" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List component="nav">
        <Link to={`${process.env.PUBLIC_URL}/membros`}>
          <ListItem button>
            <ListItemText primary="Membros" />
          </ListItem>
        </Link>
        <Link to={`${process.env.PUBLIC_URL}/admin`}>
          <ListItem button>
            <ListItemText primary="Administrador" />
          </ListItem>
        </Link>
      </List>
      </div>
    );

    return (
      <SwipeableDrawer
        open={open}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        {sideList}
      </SwipeableDrawer>
    );
  }
}