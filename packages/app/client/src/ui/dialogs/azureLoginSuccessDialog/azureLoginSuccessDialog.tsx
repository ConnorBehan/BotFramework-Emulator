import * as React from 'react';
import { Component, MouseEvent } from 'react';
import { Checkbox, Dialog, DialogFooter, PrimaryButton } from '@bfemulator/ui-react';

export interface AzureLoginSuccessDialogState {
  rememberMeChecked: boolean;
}

export interface AzureLoginSuccessDialogProps {
  cancel?: (persistLogin: boolean) => void;
  persistLogin?: boolean;

  [propName: string]: any;
}

export class AzureLoginSuccessDialog extends Component<AzureLoginSuccessDialogProps, AzureLoginSuccessDialogState> {

  constructor(props: AzureLoginSuccessDialogProps = {} as any, state: AzureLoginSuccessDialogState) {
    super(props, state);
    this.state = { rememberMeChecked: !!props.persistLogin };
  }

  public render() {
    return (
      <Dialog title="Success!" cancel={ this.onDialogCancel }>
        <p>You are now signed in with your Azure account</p>
        <Checkbox
          checked={ this.state.rememberMeChecked }
          label="Keep me signed in to the Bot Framework Emulator."
          onChange={ this.checkBoxChanged }
        />
        <DialogFooter>
          <PrimaryButton
            text="Close"
            onClick={ this.onDialogCancel }
          />
        </DialogFooter>
      </Dialog>
    );
  }

  private onDialogCancel = () => {
    this.props.cancel(this.state.rememberMeChecked);
  }

  private checkBoxChanged = (event: MouseEvent<HTMLInputElement>, isChecked: boolean) => {
    this.setState({ rememberMeChecked: isChecked });
  }
}
