import {NavigationActions} from 'react-navigation';

let topLevelNavigator = null;

function nsSetTopLevelNavigator(navigatorRef) {
  topLevelNavigator = navigatorRef;
}

function nsNavigate(routeName, params = {}) {
  if (topLevelNavigator) {
    const navigateAction = NavigationActions.navigate({routeName, params});
    topLevelNavigator.dispatch(navigateAction);
  }
}

export {nsSetTopLevelNavigator, nsNavigate};
