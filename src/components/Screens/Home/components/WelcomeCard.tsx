import { Button, Text } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import BaseComponent from '~/components/Shared/Abstract/Base';
import WithNavigation from '~/decorators/withNavigation';
import Toast from '~/facades/toast';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { logError } from '~/helpers/rxjs-operators/logError';
import { IUser } from '~/interfaces/models/user';
import userService from '~/services/user';

interface IState {
  user?: IUser;
  verified: boolean;
}

@WithNavigation()
export default class ButtonHeaderProfile extends BaseComponent<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = { verified: false };
  }

  componentWillMount(): void {
    userService
      .get()
      .pipe(
        logError(),
        bindComponent(this)
      )
      .subscribe(
        ({ data: user }) => {
          this.setState({ user, verified: true });
        },
        err => Toast.showError(err)
      );
  }

  navigateLogin = () => this.navigate('Login');
  navigateProfile = () => this.navigate('Profile');
  navigateOrder = () => this.navigate('Orders');

  render() {
    const { user, verified } = this.state;

    if (!verified) {
      return null;
    }

    if (!user) {
      return (
        <Button full onPress={this.navigateLogin}>
          <Text>Entrar</Text>
        </Button>
      );
    }

    return (
      <>
        <Button full onPress={this.navigateProfile} style={styles.listBtn}>
          <Text>Perfil</Text>
        </Button>

        <Button full onPress={this.navigateOrder}>
          <Text>Pedido</Text>
        </Button>
      </>
    );
  }
}
const styles = StyleSheet.create({
  listBtn: {
    marginBottom: 2
  }
});
