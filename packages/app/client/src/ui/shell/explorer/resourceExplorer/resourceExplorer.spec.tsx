import * as React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { combineReducers, createStore } from 'redux';
import { ResourceExplorerContainer } from './resourceExplorerContainer';
import { ResourceExplorer } from './resourceExplorer';
import { ServiceType } from 'msbot/bin/schema';
import resources from '../../../../data/reducer/resourcesReducer';
import { BotConfigWithPathImpl } from '@bfemulator/sdk-shared';
import { openContextMenuForResource, openResource, renameResource } from '../../../../data/action/resourcesAction';

const mockStore = createStore(combineReducers({ resources }), {});

jest.mock('../../../dialogs', () => ({
  DialogService: {
    showDialog: () => Promise.resolve(true),
    hideDialog: () => Promise.resolve(false),
  }
}));

jest.mock('../servicePane/servicePane.scss', () => ({}));
jest.mock('./resourceExplorer.scss', () => ({}));

describe('The ServicesExplorer component should', () => {
  let parent;
  let node;
  let mockChat;
  let mockTranscript;
  let mockDispatch;
  beforeEach(() => {
    mockChat = BotConfigWithPathImpl.serviceFromJSON({
      type: ServiceType.File,
      filePath: 'the/file/path/chat.chat',
      name: 'testChat'
    } as any);

    mockTranscript = BotConfigWithPathImpl.serviceFromJSON({
      type: ServiceType.File,
      filePath: 'the/file/path/transcript.transcript',
      name: 'testTranscript'
    } as any);

    parent = mount(<Provider store={ mockStore }>
      <ResourceExplorerContainer files={ [mockChat, mockTranscript] }/>
    </Provider>);
    node = parent.find(ResourceExplorer);

    mockDispatch = jest.spyOn(mockStore, 'dispatch');
  });

  it('should render deeply', () => {
    expect(parent.find(ResourceExplorerContainer)).not.toBe(null);
    expect(parent.find(ResourceExplorer)).not.toBe(null);
  });

  it('should open the chat file when a list item is clicked', () => {
    node.instance().onLinkClick({ currentTarget: { dataset: { index: 0 } } });
    expect(mockDispatch).toHaveBeenCalledWith(openResource(mockChat));
  });

  it('should open the transcript file when a list item is clicked', () => {
    node.instance().onLinkClick({ currentTarget: { dataset: { index: 1 } } });
    expect(mockDispatch).toHaveBeenCalledWith(openResource(mockTranscript));
  });

  it('should dispatch a request to open the context menu when right clicking on a list item', () => {
    const instance = node.instance();
    const mockLi = document.createElement('li');
    mockLi.setAttribute('data-index', '0');

    instance.onContextMenuOverLiElement(mockLi);
    expect(mockDispatch).toHaveBeenCalledWith(openContextMenuForResource(mockChat));
  });

  it('should dispatch to rename the resource when the enter key is pressed while focused in an input field', () => {
    const instance = node.instance();
    instance.setState({ fileToRename: mockTranscript });
    instance.onInputKeyUp({ which: 13 });
    expect(mockDispatch).toHaveBeenCalledWith(renameResource(mockTranscript));
  });
});
