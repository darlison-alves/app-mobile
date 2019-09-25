import { NavigationActions, StackActions } from 'react-navigation';
import { InteractionManager } from '~/facades/interactionManager';
import { INotificationHandler } from '~/interfaces/notification';

export const handle: INotificationHandler<{ id: string }> = async (dispatch, info, appStarted) => {
  const id = Number(info.data.id);

  if (appStarted) {
    dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Home',
            action: NavigationActions.navigate({
              routeName: 'Profile'
            })
          }),
          NavigationActions.navigate({
            routeName: 'Orders'
          })
        ]
      })
    );

    await InteractionManager.runAfterInteractions();
  }

  dispatch({
    type: 'Navigation/NAVIGATE',
    routeName: 'InformativeDetails',
    params: { id }
  });
};
