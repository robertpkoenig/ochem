import {
  Minus,
  MinusCircle,
  Plus,
  PlusCircle,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "react-feather";
import Ion, { IonType } from "../../../../canvas/model/chemistry/atoms/Ion";
import BondType from "../../../../canvas/model/chemistry/bonds/BondType";
import { ArrowType } from "../../../../canvas/model/chemistry/CurlyArrow";
import { ITeacherState } from "../../../../pages/teacher/reactions/[reactionId]";
import SquareButton from "../../../common/buttons/SquareButton";

interface IProps {
  state: ITeacherState;
  setState: (state: ITeacherState) => void;
}

function EditorLeftButtons(props: IProps) {
  function undo() {
    props.state.controller.undoManager.undo();
  }

  function redo() {
    props.state.controller.undoManager.redo();
  }

  // Turns on and off the eraser.
  function toggleEraser() {
    props.setState({
      ...props.state,
      eraserOn: !props.state.eraserOn,
      bondType: null,
      arrowType: null,
      straightArrowSelected: false,
      selectedIonType: null,
      lonePairSelected: false,
      angleControlSelected: false,
    });
  }

  function setBondType(bondType: BondType) {
    // If the bond type is already selected, and the user
    // is pressing this bond type button again, simply set
    // the bond type to null, as the user is turning off the
    // bond drawing altogether
    if (props.state.bondType == bondType) {
      props.setState({ ...props.state, bondType: null });
    } else {
      props.setState({
        ...props.state,
        bondType: bondType,
        arrowType: null,
        eraserOn: false,
        straightArrowSelected: false,
        selectedIonType: null,
        lonePairSelected: false,
        angleControlSelected: false,
      });
    }
  }

  function setArrowType(arrowType: ArrowType) {
    // If the arrow type is already selected, and the user
    // is pressing this arrow type button again, simply set
    // the arrow type to null, as the user is turning off the
    // arrow drawing altogether
    if (props.state.arrowType == arrowType) {
      props.setState({ ...props.state, arrowType: null });
    } else {
      props.setState({
        ...props.state,
        arrowType: arrowType,
        bondType: null,
        eraserOn: false,
        straightArrowSelected: false,
        angleControlSelected: false,
        selectedIonType: null,
        lonePairSelected: false,
      });
    }
  }

  function selectIon(ionType: IonType) {
    // If the ion type is already selected, and the user
    // is pressing this ion type button again, simply set
    // the ion type to null, as the user is turning off the
    // ion drawing altogether
    if (props.state.selectedIonType == ionType) {
      props.setState({
        ...props.state,
        selectedIonType: null,
      });
    } else {
      props.setState({
        ...props.state,
        selectedIonType: ionType,
        eraserOn: false,
        bondType: null,
        arrowType: null,
        straightArrowSelected: false,
        angleControlSelected: false,
        lonePairSelected: false,
      });
    }
  }

  function toggleLonePair() {
    props.setState({
      ...props.state,
      lonePairSelected: !props.state.lonePairSelected,
      eraserOn: false,
      bondType: null,
      arrowType: null,
      straightArrowSelected: false,
      angleControlSelected: false,
      selectedIonType: null,
    });
  }

  function toggleStraightArrow() {
    props.setState({
      ...props.state,
      straightArrowSelected: !props.state.straightArrowSelected,
      eraserOn: false,
      bondType: null,
      selectedIonType: null,
      arrowType: null,
      angleControlSelected: false,
      lonePairSelected: false,
    });
  }

  function incrementZoom() {
    props.state.reaction.zoom += 0.1;
  }

  function decrementZoom() {
    props.state.reaction.zoom -= 0.1;
  }

  const bondTypeButtons = Object.values(BondType).map((bondType) => {
    return (
      <SquareButton
        key={bondType}
        imageSrc={"/assets/images/bonds/" + bondType + ".svg"}
        imageAltText={bondType + " bond"}
        onMouseDown={() => setBondType(bondType)}
        selected={props.state.bondType === bondType}
        tip="Bond type"
      />
    );
  });

  const doubleCurlyArrowButton = (
    <SquareButton
      imageSrc={"/assets/images/curly_arrows/double.svg"}
      imageAltText={"double curly arrow"}
      onMouseDown={() => setArrowType(ArrowType.DOUBLE)}
      selected={props.state.arrowType == ArrowType.DOUBLE}
      tip="Curly arrow"
    />
  );

  const straightArrowButton = (
    <SquareButton
      imageSrc={"/assets/images/straight-arrow.svg"}
      imageAltText={"straight arrow"}
      onMouseDown={toggleStraightArrow}
      selected={props.state.straightArrowSelected}
      tip="Reaction arrow"
    />
  );

  const selectCationButton = (
    <SquareButton
      onMouseDown={() => selectIon("+")}
      selected={props.state.selectedIonType == "+"}
      tip="Cation"
    >
      <PlusCircle className="w-4 h-4" />
    </SquareButton>
  );

  const selectAnionButton = (
    <SquareButton
      onMouseDown={() => selectIon("-")}
      selected={props.state.selectedIonType == "-"}
      tip="Anion"
    >
      <MinusCircle className="w-4 h-4" />
    </SquareButton>
  );

  const lonePairButton = (
    <SquareButton
      imageSrc="/assets/images/lone-pair.svg"
      imageAltText="lone pair"
      onMouseDown={toggleLonePair}
      selected={props.state.lonePairSelected}
      tip="Lone pair"
    />
  );

  const eraserButton = (
    <SquareButton
      imageSrc={"/assets/images/eraser.svg"}
      imageAltText={"eraser"}
      onMouseDown={toggleEraser}
      selected={props.state.eraserOn}
      tip="Eraser"
    />
  );

  const undoButton = (
    <SquareButton onMouseDown={() => undo()} selected={false} tip="Undo">
      <RotateCcw className="w-3.5 h-3.5" />
    </SquareButton>
  );

  const redoButton = (
    <SquareButton onMouseDown={() => redo()} selected={false} tip="Redo">
      <RotateCw className="w-3.5 h-3.5" />
    </SquareButton>
  );

  const zoomInButton = (
    <SquareButton onMouseDown={incrementZoom} selected={false} tip="Zoom in">
      <ZoomIn className="w-3.5 h-3.5" />
    </SquareButton>
  );

  const zoomOutButton = (
    <SquareButton onMouseDown={decrementZoom} selected={false} tip="Zoom out">
      <ZoomOut className="w-3.5 h-3.5" />
    </SquareButton>
  );

  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 h-full">
      {bondTypeButtons}
      <hr className="my-2"></hr>
      {doubleCurlyArrowButton}
      <hr className="my-2"></hr>
      {straightArrowButton}
      <hr className="my-2"></hr>
      {selectCationButton}
      {selectAnionButton}
      {lonePairButton}
      <hr className="my-2"></hr>
      {eraserButton}
      {undoButton}
      {redoButton}
      <hr className="my-2"></hr>
      {zoomInButton}
      {zoomOutButton}
    </div>
  );
}

export default EditorLeftButtons;
