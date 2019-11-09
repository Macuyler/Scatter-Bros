import React, { useState } from 'react';
import { Redirect } from 'react-router';
import Draggable from 'react-draggable';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Fab, Button, Divider, Modal, Paper, TextField, Tooltip } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import clsx from 'clsx';
import { connectors } from './globals.js';

const drawerWidth = 480;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: 'rgba(219, 34, 42, 1)',
        flexDirection: 'row',
        alignItems: 'space-between'
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#6C6C6C'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'space-between',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

const Editor = () => {
    const [showDrawer, setShowDrawer] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [pipes, setPipes] = useState([]);
    const [selected, setSelected] = useState({ id: 1, pipeType: 1, rot: 1 });
    const [goToCheckout, setGoToCheckout] = useState(false);
    const [moving, setMoving] = useState(false);
    const [checkoutData, setCheckoutData] = useState([]);
    const [name, setName] = useState('');

    const getIndex = (s) => pipes.indexOf(pipes.find(e => e.id === s.id));

    const rotate = () => {
        if (selected) {
            const s = getIndex(selected);
            selected.rot += 1;
            selected.rot %= 4;
            pipes[s] = selected;
            setPipes([...pipes]);
        }
    };

    const addPipe = (pipeType, custoRot) => {
        const p = { id: Math.floor(Math.random() * 2000), pipeType, rot: custoRot || 0 };
        setPipes([...pipes, p]);
        setSelected(p);
    };

    const deleteSelected = () => {
        if (selected) {
            const s = getIndex(selected);
            selected.rot += 1;
            selected.rot %= 4;
            pipes.splice(s, 1);
            setPipes([...pipes]);
        }
    }

    const checkout = () => {
        const data = {};
        pipes.forEach(p => {
            const k = `pipe${p.pipeType}`;
            if (Object.keys(data).includes(k)) {
                data[k] += 1;
            } else {
                data[k] = 1;
            }
        });
        const c = Object.keys(data).map(d => ({ pipeType: d, quantity: data[d] }));
        setCheckoutData(c);
        setGoToCheckout(true);
    };

    const handleDrop = (id) => {
        const t = document.getElementById(id).style.transform;
        if (t) {
            const x = Number(t.split('(')[1].split('px')[0]);
            const y = Number(t.split(',')[1].split('px')[0]);
            const i = getIndex(selected);
            pipes[i].x = x;
            pipes[i].y = y;
            setPipes([...pipes]);
        }
    };

    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className="page-wrapper" style={{
            backgroundColor: '#2e2e2e',
            overflow: 'hidden'
        }}>

            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: showDrawer,
                })}
            >
                <Toolbar style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setShowDrawer(true)}
                        edge="start"
                        className={clsx(classes.menuButton, showDrawer && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Scatter Bros Creator
                    </Typography>
                    <Button onClick={() => setShowModal(true)} color="inherit"><ShoppingCartIcon style={{ marginRight: 8 }} />Purchase</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={showDrawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <Typography variant="h6" style={{ marginLeft: 15, color: '#fff' }}>Select a Part:</Typography>
                    <IconButton onClick={() => setShowDrawer(false)}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <Tooltip title="2 Inch Pipe" placement="right">
                <button className="blank" onClick={() => addPipe(2)}>
                    <div className="pipe2" style={{ position: 'relative', margin: '10px 0 0 15px', border: 'none' }}></div>
                </button>
                </Tooltip>
                <Tooltip title="3 Inch Pipe" placement="right">
                <button className="blank" onClick={() => addPipe(3)}>
                    <div className="pipe3" style={{ position: 'relative', margin: '10px 0 0 15px', border: 'none' }}></div>
                </button>
                </Tooltip>
                <Tooltip title="5 Inch Pipe" placement="right">
                <button className="blank" onClick={() => addPipe(5)}>
                    <div className="pipe5" style={{ position: 'relative', margin: '10px 0 0 15px', border: 'none' }}></div>
                </button>
                </Tooltip>
                <Tooltip title="7 Inch Pipe" placement="right">
                <button className="blank" onClick={() => addPipe(7)}>
                    <div className="pipe7" style={{ position: 'relative', margin: '10px 0 0 15px', border: 'none' }}></div>
                </button>
                </Tooltip>
                <Tooltip title="90deg Elbow" placement="right">
                <button className="blank" onClick={() => addPipe(90)}>
                    <div className="pipe90" style={{ position: 'relative', margin: '10px 0 0 15px' }}>
                        <span style={{ border: 'none' }} />
                        <span style={{ border: 'none' }} />
                        <span style={{ border: 'none' }} />
                        <span style={{ border: 'none' }} />
                    </div>
                </button>
                </Tooltip>
                <Tooltip title="T Connector" placement="right">
                <button className="blank" onClick={() => addPipe('t')}>
                    <div className="pipet" style={{ position: 'relative', margin: '10px 0 0 15px' }}>
                        <span style={{ border: 'none' }} />
                        <span style={{ border: 'none' }} />
                        <span style={{ border: 'none' }} />
                        <span style={{ border: 'none' }} />
                        <span style={{ border: 'none' }} />
                        <span style={{ border: 'none' }} />
                    </div>
                </button>
                </Tooltip>
                <Tooltip title="Pipe Cap" placement="right">
                <button className="blank" onClick={() => addPipe('cap', 3)}>
                    <div className="pipecap" style={{ position: 'relative', margin: '10px 0 0 15px', border: 'none' }}></div>
                </button>
                </Tooltip>
                <Tooltip title="Coupler (Connector)" placement="right">
                <button className="blank" onClick={() => addPipe('con')}>
                    <div className="pipecon still" style={{ position: 'relative', margin: '10px 0 0 15px' }}></div>
                </button>
                </Tooltip>
            </Drawer>

            <Tooltip title="Rotate" placement="top">
                <Fab onClick={rotate} color="primary" aria-label="Rotate" style={{ position: 'absolute', bottom: 30, right: 30 }}>
                    <RotateRightIcon />
                </Fab>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
                <Fab onClick={deleteSelected} color="secondary" aria-label="Delete" size="medium" style={{ position: 'absolute', bottom: 30, right: 110 }}>
                    <DeleteIcon />
                </Fab>
            </Tooltip>
            {pipes.map((p, i) => (
                <Draggable
                    key={p.id}
                    defaultPosition={{ x: 520, y: 104 }}
                    grid={[52, 52]}
                    scale={1}
                    onStart={() => {
                        setSelected(p);
                        setMoving(true);
                    }}
                    onStop={() => {
                        handleDrop(`${p.pipeType}-${p.id}`);
                        setMoving(false);
                    }}
                >
                    <div id={`${p.pipeType}-${p.id}`} className={`pipe${p.pipeType}${p.rot ? ` rot${p.rot}` : ''}${i === getIndex(selected) ? ' selected' : ''}${!moving ? ' still' : ''}`} style={{ zIndex: connectors.includes(p.pipeType) ? 5 : 3 }}>
                        {p.pipeType === 90 ? (
                            <>
                                <span />
                                <span />
                                <span />
                                <span />
                            </>
                        ) : null }
                        {p.pipeType === 't' ? (
                            <>
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />
                                <span />
                            </>
                        ) : null }
                    </div>
                </Draggable>
            ))}
            <Modal
                aria-labelledby="Name Prompt"
                aria-describedby="Enter a name for your new Launcher"
                open={showModal}
                onClose={() => setShowModal(false)}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                disableAutoFocus
            >
                <Paper style={{ width: '50%', height: 300, outline: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <h1 style={{ textAlign: 'center', marginTop: 60 }}>Enter a name for your Marshmallow launcher</h1>
                    <TextField style={{ width: '60%' }} variant="outlined" color="secondary" value={name} onChange={e => setName(e.target.value)} label="Name" />
                    <div style={{ marginTop: 20, width: '50%', display: 'flex', justifyContent: 'space-around' }}>
                        <Button onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={checkout}>Submit</Button>
                    </div>
                </Paper>
            </Modal>
            {goToCheckout ? <Redirect to={{ pathname: "/checkout", state: { parts: checkoutData, name } }} /> : null}
        </div>
    );
};

export default Editor;