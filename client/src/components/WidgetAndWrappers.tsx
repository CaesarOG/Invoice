import React from 'react'
import { ActionType } from 'typesafe-actions'
import { RootState } from 'MyTypes'
import { connect, MapStateToProps } from 'react-redux' //MapDispatchToProps
import classnames from 'classnames'
import { Paper, IconButton, Menu, MenuItem, withStyles, WithStyles, makeStyles,
  withTheme, createStyles, Theme, Badge as BadgeBase,
  Typography as TypographyBase, Button as ButtonBase, ButtonProps } from '@material-ui/core'
import { MoreVert as MoreIcon } from '@material-ui/icons'
import { TypographyProps } from '@material-ui/core/Typography'
import { BadgeProps } from '@material-ui/core/Badge'
import { WidgetAction } from '../actions' 
import { createPropsGetter } from '../actions/services/models';
import { WidgetState, widgInitialState } from '../reducers/WidgetReducer'
import { Variant } from '@material-ui/core/styles/createTypography';



//before it was a function that manually said return and the object
const mapStateToPropsW: MapStateToProps<WidgetState, {}, RootState> = (state: RootState) => ({
  moreButtonRef: state.WidgetReducer.moreButtonRef
});

type WidgetAction = ActionType<typeof WidgetAction>;
//Map Redux Actions to component props
const mapDispatchToPropsW = {
  handleMenu: WidgetAction.handleMenu,
  handleCloseMenu: WidgetAction.handleCloseMenu //menu close
}

const useWgStyl = makeStyles((theme:Theme) => ({
  widgetWrapper: {
    display: "flex",
    minHeight: "100%"
  },
  widgetHeader: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  widgetRoot: {
    boxShadow: "0px 3px 11px 0px rgba(232,234,252,1),0px 3px 3px -2px rgba(178,178,178,0.1),0px 1px 8px 0px rgba(154,154,154,0.1)"
  },
  widgetBody: {
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3)
  },
  noPadding: {
    padding: 0
  },
  paper: {
    display: "flex",
    flexDirection: "column" as "column",
    flexGrow: 1,
    overflow: "hidden"
  },
  moreButton: {
    margin: -theme.spacing(1),
    padding: 0,
    width: 40,
    height: 40,
    color: theme.palette.text.hint,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "rgba(255, 255, 255, 0.35)"
    }
  }
}) );

const wgStyles = (theme: Theme) => createStyles({
  widgetWrapper: {
    display: "flex",
    minHeight: "100%"
  },
  widgetHeader: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  widgetRoot: {
    boxShadow: "0px 3px 11px 0px rgba(232,234,252,1),0px 3px 3px -2px rgba(178,178,178,0.1),0px 1px 8px 0px rgba(154,154,154,0.1)"
  },
  widgetBody: {
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3)
  },
  noPadding: {
    padding: 0
  },
  paper: {
    display: "flex",
    flexDirection: "column" as "column",
    flexGrow: 1,
    overflow: "hidden"
  },
  moreButton: {
    margin: -theme.spacing(1),
    padding: 0,
    width: 40,
    height: 40,
    color: theme.palette.text.hint,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "rgba(255, 255, 255, 0.35)"
    }
  }
});

type StatePropsW = ReturnType<typeof mapStateToPropsW>; 
type DispatchPropsW = typeof mapDispatchToPropsW;
type OwnPropsW = {header: any, title: string, children: JSX.Element[], noBodyPadding: {[x:string]: any}, bodyClass: any, className: any, disableWidgetMenu: boolean};
type PropsW = Partial<StatePropsW & DispatchPropsW & OwnPropsW>
const getPropsW = createPropsGetter(Object.assign({}, widgInitialState, mapDispatchToPropsW))

const Widget: React.FC<PropsW> = props => {

  const classes = useWgStyl()

    const { moreButtonRef, header, title, disableWidgetMenu, handleMenu, handleCloseMenu, children, noBodyPadding, bodyClass } = getPropsW(props)
    const menuOpen = Boolean(moreButtonRef)

    return(
      <div className={classes.widgetWrapper}>
        <Paper className={classes.paper} classes={{ root: classes.widgetRoot}}>
          <div className={classes.widgetHeader}>
            {header ? (
              header
            ) : (
              <React.Fragment>
                <Typography variant="h1" color="primary" colorBrightness="main">
                  {title}
                </Typography>
                {!disableWidgetMenu && (
                  <IconButton color="primary" classes={{ root: classes.moreButton }} onClick={handleMenu}>  <MoreIcon />  </IconButton>
                )}
              </React.Fragment>
            )}
          </div>
          <div className={  classnames( classes.widgetBody, {[classes.noPadding]: noBodyPadding, [bodyClass]: bodyClass} )  }>
            {children}
          </div>
        </Paper>
        <Menu id="widget-menu" open={menuOpen} anchorEl={moreButtonRef} onClose={handleCloseMenu} disableAutoFocusItem>
          <MenuItem>
            <Typography>Edit</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Copy</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Delete</Typography>
          </MenuItem>
          <MenuItem>
            <Typography>Print</Typography>
          </MenuItem>
        </Menu>
      </div>
    );

}

const stylesWidget = withStyles(wgStyles)(Widget)

const connectedWidget = connect<StatePropsW, DispatchPropsW, {}, RootState>(
  mapStateToPropsW,
  mapDispatchToPropsW
)(stylesWidget);

export { connectedWidget as Widget }



const getColor = (color: "primary"|"secondary"|"error", theme: Theme, brightness: 'light'|'main'|'dark') => {
  if (!color) return theme.palette.text.secondary
  if (color && theme.palette[color] && theme.palette[color][brightness]) {
    return theme.palette[color][brightness];
  }
};

const getFontWeight = (style: string) => {
  switch(style) {
    case "light":
      return 300;
    case "medium":
      return 500;
    case "bold":
      return 600
    default:
      return 400;
  }
}


const getFontSize = (size: string, variant: Variant, theme: Theme) => {
  let multiplier;

  switch(size) {
    case "sm":
      multiplier = 0.8;
      break;
    case "md":
      multiplier = 1.5;
      break;
    case "xl":
      multiplier = 2;
      break;
    case "xxl":
      multiplier = 3;
      break;
    default:
      multiplier = 1;
      break;
  }

  const defaultSize = variant && theme.typography[variant] ?
  theme.typography[variant].fontSize : theme.typography.fontSize + "px"

  return `calc(${defaultSize} * ${multiplier})`;

};

const createStyled = (styles: any) => {
  const Styled = (props: (WithStyles<typeof styles> & {children: any}) ) => {
    const { children, ...other } = props;
    return children(other);
  }
  return withStyles(styles)(Styled);
}



const bgStyles = () => createStyles({
  badge: {
    fontWeight: 600,
    height: 16,
    minWidth: 16
  }
})
type bgProps = Partial<{theme: Theme, children: any, colorBrightness: "main"|"light"|"dark", color: "primary"|"secondary"|"error"} 
  & WithStyles<typeof bgStyles> & BadgeProps >;

const bgExtend: React.FC<bgProps> = ({ classes, theme, children, colorBrightness, ...props}: bgProps) => {
  const Styled = createStyled({
    badge: {
      backgroundColor: getColor(props.color!, theme!, colorBrightness!)
    }
  });

  return(
    <Styled>
      {(styledProps: {classes: {[x: string]: any}}) => (
        <BadgeBase classes={{
          badge: classnames(classes!.badge, styledProps.classes.badge)
          }}
          {...props}
        >
          {children}
        </BadgeBase>
      )}
    </Styled>
  );
}

export const Badge = withStyles(bgStyles, {withTheme: true})(bgExtend)


type tgProps = Partial<{theme: Theme, children: any, weight: string, size: string, colorBrightness: "main"|"light"|"dark", 
  color: "primary"|"secondary", variant: Variant}> & TypographyProps;

const tgExtend: React.FC<tgProps> = ({ theme, children, weight, size, colorBrightness, ...props}: tgProps) => (
  <TypographyBase style={{
    color: getColor(props.color!, theme!, colorBrightness!), fontWeight: getFontWeight(weight!), fontSize: getFontSize(size!, props.variant!, theme!)
    }}
    {...props!}
  >
    {children!}
  </TypographyBase>
)

export const Typography = withTheme<React.FC<tgProps>>(tgExtend)


type btProps = Partial<{theme: Theme, children: any, color: "primary"}> & ButtonProps;

const btExtend: React.FC<btProps> = ({ theme, children, ...props}: btProps) => {
  const Styled = createStyled({
    button: {
      backgroundColor: getColor(props.color!, theme!, "light"),
      boxShadow: "0px 3px 11px 0px rgba(232,234,252,1),0px 3px 3px -2px rgba(178,178,178,0.1),0px 1px 8px 0px rgba(154,154,154,0.1)", //widget
      color: "white",
      '&:hover': {
        backgroundColor: getColor(props.color!, theme!, 'light'),
        boxShadow: "0px 12px 33px 0px rgba(232,234,252,1),0px 3px 3px -2px rgba(178,178,178,0.1),0px 1px 8px 0px rgba(154,154,154,0.1)" //widgetWide
      }
    }
  });

  return(
    <Styled>
      {(styledProps: {classes: {[x: string]: any}}) => (
        <ButtonBase classes={{ root: styledProps.classes.button }} {...props!}>
          {children!}
        </ButtonBase>
      )}
    </Styled>
  );
};

export const Button = withTheme(btExtend)