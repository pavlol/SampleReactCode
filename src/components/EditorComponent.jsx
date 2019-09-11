import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    convertToRaw,
    CompositeDecorator,
    Editor,
    EditorState,
    RichUtils,
    } from 'draft-js';
import * as actions from '../actions';
import 'draft-js/dist/Draft.css';


class EditorComponent extends Component{
  constructor(props){
      super(props);

      const decorator = new CompositeDecorator([
            {
              strategy: findLinkEntities,
              component: Link,
            },
          ]);

      this.state = {
        articles : {"article1" : "Test test test Test test test"},
        editorState: EditorState.createEmpty(decorator),
        showURLInput: false,
            urlValue: '',
      }
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => {
      this.setState({editorState});
      this.logState();
    } 
    this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(content));
          };

    this.handleKeyCommand = this.handleKeyCommand.bind(this);
      

    this.promptForLink = this._promptForLink.bind(this);
    this.onURLChange = (e) => this.setState({urlValue: e.target.value});
    this.confirmLink = this._confirmLink.bind(this);
    this.onLinkInputKeyDown = this._onLinkInputKeyDown.bind(this);
    this.removeLink = this._removeLink.bind(this);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  updateText = (input) => {
    this.setState({
        articles : {"article1" : input}
    }); 
    return this.state.articles.article1;
  }

  handleSaveText = () => {

    this.props.saveArticle(this.state.articles, () => alert(this.state.articles.article1));
  }

    _onBoldClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }


_promptForLink(e) {
          e.preventDefault();
          const {editorState} = this.state;
          const selection = editorState.getSelection();
          if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const startKey = editorState.getSelection().getStartKey();
            const startOffset = editorState.getSelection().getStartOffset();
            const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
            const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
            let url = '';
            if (linkKey) {
              const linkInstance = contentState.getEntity(linkKey);
              url = linkInstance.getData().url;
            }
            this.setState({
              showURLInput: true,
              urlValue: url,
            }, () => {
              setTimeout(() => this.refs.url.focus(), 0);
            });
          }
        }
        _confirmLink(e) {
          e.preventDefault();
          const {editorState, urlValue} = this.state;
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            {url: urlValue}
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
          this.setState({
            editorState: RichUtils.toggleLink(
              newEditorState,
              newEditorState.getSelection(),
              entityKey
            ),
            showURLInput: false,
            urlValue: '',
          }, () => {
            setTimeout(() => this.refs.editor.focus(), 0);
          });
        }
        _onLinkInputKeyDown(e) {
          if (e.which === 13) {
            this._confirmLink(e);
          }
        }
        _removeLink(e) {
          e.preventDefault();
          const {editorState} = this.state;
          const selection = editorState.getSelection();
          if (!selection.isCollapsed()) {
            this.setState({
              editorState: RichUtils.toggleLink(editorState, selection, null),
            });
          }
        }



  render(){
    //   console.log("initial local state");
    //   console.log(this.state.articles);
    
    let urlInput;
          if (this.state.showURLInput) {
            urlInput =
              <div style={styles.urlInputContainer}>
                <input
                  onChange={this.onURLChange}
                  ref="url"
                  style={styles.urlInput}
                  type="text"
                  value={this.state.urlValue}
                  onKeyDown={this.onLinkInputKeyDown}
                />
                <button onMouseDown={this.confirmLink}>
                  Confirm
                </button>
              </div>;
          }

    return(
      <div>
        {/* <div>
            <div contentEditable={true} onChange={this.updateText.bind(this)}>

            {this.state.articles.article1}
            </div>
            <button onClick={this.handleSaveText}>Save Article</button>
        </div>
        <div>
            {this.props.articles.article1}
        </div> */}
        <div>
          <div style={styles.buttons}>
            <button onClick={this._onBoldClick.bind(this)}>Bold</button>
            <button
                onMouseDown={this.promptForLink}
                style={{marginRight: 10}}>
                Add Link
            </button>
            <button 
                onMouseDown={this.removeLink}>
                Remove Link
            </button>
            </div>
            {urlInput}
            <div style={styles.editor}>
              <Editor 
                editorState={this.state.editorState} 
                onChange={this.onChange} 
                placeholder="Enter some text..."
                handleKeyCommand={this.handleKeyCommand}
                readOnly={false}
                />
            </div>
        </div>
        <div>
        <h4>Editor contents</h4>
        <pre>
        {this.logState()}
        </pre>
        </div>
      </div>
    )
  }
}

function findLinkEntities(contentBlock, callback, contentState) {
        contentBlock.findEntityRanges(
          (character) => {
            const entityKey = character.getEntity();
            return (
              entityKey !== null &&
              contentState.getEntity(entityKey).getType() === 'LINK'
            );
          },
          callback
        );
      }
      const Link = (props) => {
        const {url} = props.contentState.getEntity(props.entityKey).getData();
        return (
          <a href={url} style={styles.link}>
            {props.children}
          </a>
        );
      };

const styles = {
        root: {
          fontFamily: '\'Georgia\', serif',
          padding: 20,
          width: 600,
        },
        buttons: {
          marginBottom: 10,
        },
        urlInputContainer: {
          marginBottom: 10,
        },
        urlInput: {
          fontFamily: '\'Georgia\', serif',
          marginRight: 10,
          padding: 3,
        },
        editor: {
          border: '2px solid #000',
          cursor: 'text',
          minHeight: 80,
          padding: 10,
        },
        button: {
          marginTop: 10,
          textAlign: 'center',
        },
        link: {
          color: '#3b5998',
          textDecoration: 'underline',
        },
      };


function mapStateToProps(state){
  return {articles: state.blog.articles}
}

const mapPropsToActions = {
    saveArticle : actions.saveArticle
};


export default connect(mapStateToProps, mapPropsToActions)(EditorComponent);
