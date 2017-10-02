/**
  * <Preview />
  */

import React from 'react';
import ElementStore from './stores/ElementStore';
import ElementActions from './actions/ElementActions';
import {Header,Paragraph,Label,LineBreak,TextInput,NumberInput,TextArea,Dropdown,Checkboxes,DatePicker,RadioButtons,Image,Rating,Tags,Signature,HyperLink,Download,Camera,Range} from './form-elements';
import FormElementsEdit from './form-elements-edit';

export default class Preview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      answer_data: {}
    }

    var loadData = (this.props.url) ? this.props.url : (this.props.data) ? this.props.data : [];
    var saveUrl = (this.props.saveUrl) ? this.props.saveUrl : '';

    ElementStore.load(loadData, saveUrl);
    ElementStore.listen(this._onChange.bind(this));
  }

  _setValue(text) {
    return text.replace(/[^A-Z0-9]+/ig, "_").toLowerCase();
  }

  updateElement(element) {
    let data = this.state.data;
    let found = false;

    for(var i=0, len=data.length; i < len; i++) {
      if (element.id === data[i].id) {
        data[i] = element;
        found = true;
        break;
      }
    }

    if (found) {
      ElementActions.saveData(data);
    }
  }

  _onChange(data) {

    let answer_data = {};

    data.forEach((item) => {
      if (item.readOnly && this.props.variables[item.variableKey]) {
        answer_data[item.field_name] = this.props.variables[item.variableKey];
      }
    });

    this.setState({
      data,
      answer_data
    });
  }

  _onDestroy(item) {
    ElementActions.deleteElement(item);
  }

  handleSort(orderedIds) {
    let sortedArray = [];
    let data = this.state.data;
    let index = 0;

    for(var i=0, len=data.length; i < len; i++) {
      index = orderedIds.indexOf(data[i].id);
      sortedArray[index] = data[i];
    }

    ElementActions.saveData(sortedArray);
    this.state.data = sortedArray;
  }

  render() {
    let classes = this.props.className;
    if (this.props.editMode) { classes += ' is-editing'; }
    let items = this.state.data.map( item => {
      const itemProps = {
        mutable: false,
        parent: this.props.parent,
        editModeOn: this.props.editModeOn,
        isDraggable: true,
        key: item.id,
        sortData: item.id,
        data: item,
        _onDestroy: this._onDestroy
      }

      return React.createElement(elementMap[item.element], itemProps)

          // return <Signature {...itemProps} read_only={item.readOnly} defaultValue={this.state.answer_data[item.field_name]} />


    })
    return (
      <div className={classes}>
        <div className="edit-form">
          { this.props.editElement !== null &&
            <FormElementsEdit showCorrectColumn={this.props.showCorrectColumn} files={this.props.files} manualEditModeOff={this.props.manualEditModeOff} preview={this} element={this.props.editElement} updateElement={this.updateElement} />
          }
        </div>
        {/* <Sortable sensitivity={0} key={this.state.data.length} onSort={this.handleSort.bind(this)}> */}
        <div className="Sortable">
          {items}
        {/* </Sortable> */}
        </div>
      </div>
    )
  }
}

const elementMap = {
  "Header": Header,
  "Paragraph": Paragraph,
  "Label": Label,
  "LineBreak": LineBreak,
  "TextInput": TextInput,
  "NumberInput": NumberInput,
  "TextArea": TextArea,
  "Dropdown": Dropdown,
  "Checkboxes": Checkboxes,
  "DatePicker": DatePicker,
  "RadioButtons": RadioButtons,
  "Rating": Rating,
  "Image": Image,
  "Tags": Tags,
  "Signature": Signature,
  "HyperLink": HyperLink,
  "Download": Download,
  "Camera": Camera,
  "Range": Range
}
Preview.defaultProps = { showCorrectColumn: false, files: [], editMode: false, editElement: null, className: 'react-form-builder-preview pull-left'}
