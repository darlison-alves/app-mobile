import FieldText from '@react-form-fields/native-base/Text';
import ValidationContext from '@react-form-fields/native-base/ValidationContext';
import { Button, Container, Content, Icon, List, Text, View } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { filter, tap } from 'rxjs/operators';
import { classes, variablesTheme } from '~/assets/theme';
import FormComponent, { IStateForm } from '~/components/Shared/Abstract/Form';
import Toast from '~/facades/toast';
import { bindComponent } from '~/helpers/rxjs-operators/bindComponent';
import { loader } from '~/helpers/rxjs-operators/loader';
import { logError } from '~/helpers/rxjs-operators/logError';
import { NavigaitonOptions } from '~/hooks/useNavigation';
import { IOrder } from '~/interfaces/models/user';
import userService from '~/services/user';

interface IState extends IStateForm<IOrder> {}

export default class OrderPage extends FormComponent<{}, IState> {
  static navigationOptions: NavigaitonOptions = ({ navigation }) => {
    return {
      title: 'Pedido',
      tabBarLabel: 'Pedido',
      headerLeft: () => (
        <Button style={classes.headerButton} onPress={navigation.toggleDrawer}>
          <Icon name='menu' style={classes.headerButtonIcon} />
        </Button>
      ),
      drawerIcon: ({ tintColor }) => <Icon name='cart' style={{ color: tintColor }} />
    };
  };

  constructor(props: any) {
    super(props);
    state = {
      model: {
        description: '',
        quantity: '',
        value: ''
      }
    };
  }

  handleSubmit = () => {
    /**
    userService
      .requestOrder(this.state.model)
      .pipe(
        valid => !valid && Toast.showError('Revise os campos'),
        filter(valid => valid),
        loader(),
        logError(),
        bindComponent(this)
      )
      .subscribe(() => alert('sucesso'), err => alert('err'));
    */
    this.isFormValid()
      .pipe(
        tap(valid => !valid && Toast.showError('Revise os campos')),
        filter(valid => valid),
        logError(),
        bindComponent(this)
      )
      .subscribe(
        () => {
          this.onSubmit();
        },
        err => Toast.showError(err)
      );
  };

  onSubmit = () => {
    userService
      .requestOrder(this.state.model as IOrder)
      .pipe(loader())
      .subscribe(
        () => {
          this.setState({
            model: {
              description: '',
              quantity: '',
              value: ''
            }
          });
          Toast.show('pedido realizar com sucesso!');
        },
        err => Toast.showError(err)
      );
  };
  render(): JSX.Element {
    let { model } = this.state;
    return (
      <Container style={classes.cardsContainer}>
        <Content>
          <View style={classes.cardsPadding}>
            <ValidationContext ref={this.bindValidationContext}>
              <List>
                <FieldText
                  label='Descrição'
                  validation='string|required|min:3|max:50'
                  value={model.description}
                  flowIndex={1}
                  onChange={this.updateModel((value, model) => (model.description = value))}
                />

                <FieldText
                  keyboardType='numeric'
                  label='Quantidade'
                  validation='numeric|required|max:50'
                  value={model.quantity}
                  flowIndex={2}
                  onChange={this.updateModel((value, model) => (model.quantity = value))}
                />

                <FieldText
                  keyboardType='numeric'
                  label='valor'
                  validation='numeric|required|max:200'
                  value={model.value}
                  flowIndex={2}
                  onChange={this.updateModel((value, model) => (model.value = value))}
                />
                <Button style={styles.button} full onPress={this.handleSubmit}>
                  <Text>Solicitar</Text>
                </Button>
              </List>
            </ValidationContext>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: variablesTheme.borderRadiusBase,
    marginTop: 10
  }
});
