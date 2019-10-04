import { LitElement, html, css } from 'lit-element';

const CSS_STYLE_FROG = 'frog';
const DEFAULT_BOXES = 5;
const DEFAULT_SELECTED = 1;
const DEFAULT_CONFIG = false;
class FrogLit extends LitElement {
  static get properties() {
    return {
      boxes: {
        type: Number,
        attribute: true,
        reflect: true
      },
      selected: {
        type: Number,
        attribute: true,
        reflect: true
      },
      config: {
        type: Boolean,
        attribute: true,
        reflect: true
      }
    };
  }
  constructor () {
    super();
    this.boxes = DEFAULT_BOXES;
    this.selected = DEFAULT_SELECTED;
    this.config = DEFAULT_CONFIG;
    this.generateObjectBoxes();
  }
  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    this.controlChanges(name, oldval, newval);
  }
  controlChanges (name, oldval, newval) {
    switch (name) {
      case 'boxes': this.controlChangeBoxes(newval, oldval); break;
      case 'selected': this.changeSelected(newval, oldval); break;
    }
  }
  controlChangeBoxes (newval, oldval) {
    if (oldval!==null) this.changeBoxes(newval, oldval);
    else this.generateObjectBoxes();
  }
  changeSelected (newPosition, oldPosition=DEFAULT_BOXES) {
    this.changeSelectedByObjects(newPosition, oldPosition);
  }
  changeBoxes (newNumberBoxes, oldNumberBoxes=DEFAULT_SELECTED) {
    this.changeBoxesByObjects(newNumberBoxes, oldNumberBoxes);
  }
  changeSelectedByObjects (newPosition, oldPosition) {
    if (this.boxesElements && this.boxesElements.length && oldPosition > -1){
      const positionFrog = this.getPositionFrogAdvanced();
      const newPositionSelection = newPosition <= this.boxesElements.length ? newPosition : 1;

      this.selected = newPositionSelection;
      // this.set(`boxesElements.${positionFrog-1}`, this.getBoxObject(positionFrog, false));
      // this.set(`boxesElements.${newPositionSelection-1}`, this.getBoxObject(newPositionSelection, true));
      this.boxesElements[positionFrog-1].selected = false;
      this.boxesElements[newPositionSelection-1].selected = true;
    }
  }
  changeBoxesByObjects (newNumberBoxes, oldNumberBoxes) {
    // polymer firefox double change
    // 1st - newNumberBoxes:0 , oldNumberBoxes:5
    // 2nd - newNumberBoxes:3 , oldNumberBoxes:0
    if (!newNumberBoxes) this.oldNumberBoxesAux = oldNumberBoxes;
    if (!oldNumberBoxes) oldNumberBoxes = this.oldNumberBoxesAux;

    if (newNumberBoxes > 0) {
      if (newNumberBoxes > oldNumberBoxes) {
        this.boxes = newNumberBoxes;
        this.addBoxesByObjects();
      } else if (newNumberBoxes < oldNumberBoxes) {
        this.boxes = newNumberBoxes;
        this.removeBoxesByObjects();
      }
    }
  }
  addBoxesByObjects () {
    const numberCreatedBoxes = this.boxesElements.length;
    const numberNewBoxes = this.boxes - numberCreatedBoxes;

    for (let i = 0; i < numberNewBoxes; i++) {
      const newBox = this.getBoxObject(numberCreatedBoxes + 1, false);

      // this.push('boxesElements', newBox);
      this.boxesElements.push(newBox);
    }
  }
  removeBoxesByObjects () {
    let positionFrog = this.getPositionFrogAdvanced();
    const numberCreatedBoxes = this.boxesElements.length;
    const numberBoxes = this.boxes;

    if (positionFrog >= numberBoxes) {
      positionFrog = numberBoxes;
      this.selected = positionFrog;
      // this.set(`boxesElements.${positionFrog-1}`, this.getBoxObject(positionFrog, true));
      this.boxesElements[positionFrog-1].selected = true;
    }

    for (let i = numberCreatedBoxes-1; i >= numberBoxes; i--) {
      this.boxesElements.pop();
      // this.pop('boxesElements');
    }
  }
  getPositionFrogAdvanced () {
    return this.boxesElements.filter(box => box.selected)[0].index;
  }
  generateObjectBoxes () {
    this.boxesElements = [];
    for (let i = 0; i < this.boxes; i++) {
      const box = this.getNewBoxObject(i+1, this.selected);

      this.boxesElements.push(box);
    }
  }
  getNewBoxObject (index, itemSelected) {
    const attrSelected = index === itemSelected;

    return this.getBoxObject(index, attrSelected);
  }
  getBoxObject (index, attrSelected) {
    return {
      selected: attrSelected, 
      index
    };
  }
  getIndex (item) {
    return item.index;
  }
  getBoxClass (item) {
    return item.selected ? CSS_STYLE_FROG : '';
  }
  jumpFrogAdv (boxSelected) {
    if (boxSelected.selected) {
      const newBoxSelection = boxSelected.index < this.boxesElements.length ? this.boxesElements[ boxSelected.index ] : this.boxesElements[ 0 ];

      this.boxesElements[boxSelected.index-1].selected = false;
      this.boxesElements[newBoxSelection.index-1].selected = true;
      // this.boxesElements = [...this.boxesElements];

      this.requestUpdate();
    }
  }
  getBoxObject (index, attrSelected) {
    return {
      selected: attrSelected, 
      index
    };
  }
  render () {
    return html`
        <h2>Hi frog - ${this.boxes}!</h2>
        ${this.config?
        html`
          <div class='table'>
            <div class='row'>
              <div class='cell'>
                <label for="nboxes">Número de cajas: &nbsp;</label>
              </div>
              <div class='cell'>
                <input type="number" id="nboxes" min="1" .value=${this.boxes} @change=${this.changeInputBoxes}>
              </div>
            </div>
            <div class='row'>
              <div class='cell'>
                <label for="pfrog">Posición rana: </label>
              </div>
              <div class='cell'>
                <input type="number" id="pfrog" min="1" .value=${this.selected} @change=${this.changeInputSelection}>
              </div>
            </div>
          </div>
        `: html``
      }
        <table id='elements'>
          <tr>
            ${this.boxesElements.map(item => 
              html`<td class='${this.getBoxClass(item)}' 
                @click='${(e) => this.jumpFrogAdv(item)}'>
                ${this.getIndex(item)}</td>`
            )}
            </template>
          </tr>
        </table> 
    `;
  }
  changeInputBoxes () {
    console.log('this.boxes i : ', this.boxes);
    console.log('nboxes i : ', this.shadowRoot.getElementById('nboxes').value);
    this.changeBoxes(this.shadowRoot.getElementById('nboxes').value, this.boxes);
    // this.shadowRoot.getElementById('nboxes').value
    // this.boxes
  }
  changeInputSelection () {
    this.changeSelected(this.shadowRoot.getElementById('pfrog').value, this.selected);
  }
  static get styles() {
    return css`
    :host {
      display: block;
    }
    :host #elements td {
      width: 50px;
      height: 50px;
      background-color: orange;
      text-align: center;
      border: 2px solid orange;
    }
    :host #elements td:hover {
      border: 2px solid red;
    }
    :host .frog {
      color: rgba(0,0,0,0);
      background-image: url('images/frog.gif');
      background-size: 100%;
      background-position: center center;
      background-repeat: no-repeat;
    }
    :host .table {
      display: table;
    }
    :host .table .row {
      display: table-row;
    }
    :host .table .row .cell {
      display: table-cell;
    }
    :host .vcenter {
      vertical-align: middle;
    }`;
  }
}

customElements.define('frog-lit', FrogLit);