import { MinusCircle, PlusCircle, RotateCcw, RotateCw } from "react-feather";
import Ion from "../../../../canvas/model/chemistry/atoms/Ion";
import BondType from "../../../../canvas/model/chemistry/bonds/BondType";
import { ArrowType } from "../../../../canvas/model/chemistry/CurlyArrow";
import { ITeacherState } from "../../../../pages/teacher/reactions/[reactionId]";
import SquareButton from "../../../common/buttons/SquareButton";

interface IProps {
    state: ITeacherState
    setState: (state: ITeacherState) => void 
}

function EditorLeftButtons(props: IProps) {

    function undo() {
        props.state.controller.undoManager.undo()
    }

    function redo() {
        props.state.controller.undoManager.redo()
    }

    // Turns on and off the eraser.
    function toggleEraser() {
        props.setState({
                ...props.state,
                eraserOn: !props.state.eraserOn,
                bondType: null,
                arrowType: null,
                straightArrowSelected: false,
                selectedIon: null,
                angleControlSelected: false,
            })        
    }

    function setBondType(bondType: BondType) {

        // If the bond type is already selected, and the user
        // is pressing this bond type button again, simply set
        // the bond type to null, as the user is turning off the
        // bond drawing altogether
        if (props.state.bondType == bondType) {
            props.setState({ ...props.state, bondType: null })  
        }

        else {
            props.setState({
                    ...props.state,
                    bondType: bondType,
                    arrowType: null,
                    eraserOn: false,
                    straightArrowSelected: false,
                    selectedIon: null,
                    angleControlSelected: false,
            }) 
        }

    }

    function setArrowType(arrowType: ArrowType) {

        // If the arrow type is already selected, and the user
        // is pressing this arrow type button again, simply set
        // the arrow type to null, as the user is turning off the
        // arrow drawing altogether
        if (props.state.arrowType == arrowType) {
            props.setState({ ...props.state, arrowType: null })  
        }

        else {
            props.setState({
                    ...props.state,
                    arrowType: arrowType,
                    bondType: null,
                    eraserOn: false,
                    straightArrowSelected: false,
                    angleControlSelected: false,
                    selectedIon: null,
            }) 
        }
       
    }

    function selectIon(ion: Ion) {

        // If the ion type is already selected, and the user
        // is pressing this ion type button again, simply set
        // the ion type to null, as the user is turning off the
        // ion drawing altogether
        if (props.state.selectedIon == ion) {
            props.setState({
                    ...props.state,
                    selectedIon: null
            })  
        }

        else {
            props.setState({
                    ...props.state,
                    selectedIon: ion,
                    eraserOn: false,
                    bondType: null,
                    arrowType: null,
                    straightArrowSelected: false,
                    angleControlSelected: false,
            })
        }

    }

    function toggleStraightArrow() {
        props.setState({
                ...props.state,
                straightArrowSelected: !props.state.straightArrowSelected,
                eraserOn: false,
                bondType: null,
                selectedIon: null,
                arrowType: null,
                angleControlSelected: false,
        })
    }


    const bondTypeButtons = 
        Object.values(BondType).map(bondType => {
            return (
                <SquareButton
                    key={bondType} 
                    imageSrc={"/assets/images/bonds/" + bondType + ".svg"} 
                    imageAltText={bondType + " bond"} 
                    onMouseDown={() => setBondType(bondType)} 
                    selected={props.state.bondType === bondType}
                    tip="Bond type"
                />
            )
        })

    const doubleCurlyArrowButton =
        <SquareButton
            imageSrc={"/assets/images/curly_arrows/double.svg"} 
            imageAltText={"double curly arrow"} 
            onMouseDown={() => setArrowType(ArrowType.DOUBLE)}
            selected={props.state.arrowType == ArrowType.DOUBLE}
            tip="Curly arrow"
        />

    const straightArrowButton =
        <SquareButton
            imageSrc={"/assets/images/straight-arrow.svg"} 
            imageAltText={"straight arrow"} 
            onMouseDown={toggleStraightArrow}
            selected={props.state.straightArrowSelected}
            tip="Straight arrow"
        />

    const selectCationButton =
        <SquareButton
            onMouseDown={() => selectIon(Ion.CATION)}
            selected={props.state.selectedIon ==  Ion.CATION}
            tip="Cation"
        >
            <PlusCircle className="w-4 h-4" />
        </SquareButton> 

    const selectAnionButton =
        <SquareButton
            onMouseDown={() => selectIon(Ion.ANION)}
            selected={props.state.selectedIon ==  Ion.ANION}
            tip="Anion"
        >
            <MinusCircle className="w-4 h-4" />
        </SquareButton>
    
    const eraserButton =
        <SquareButton
            imageSrc={"/assets/images/eraser.svg"} 
            imageAltText={"eraser"} 
            onMouseDown={toggleEraser}
            selected={props.state.eraserOn}
            tip="Eraser"
        />

    const undoButton = 
        <SquareButton
            onMouseDown={() => undo()}
            selected={false}
            tip="Undo"
        >
            <RotateCcw className="w-3.5 h-3.5"/>
        </SquareButton>

    const redoButton =
        <SquareButton
            onMouseDown={() => redo()}
            selected={false}
            tip="Redo"
        >
            <RotateCw className="w-3.5 h-3.5" />
        </SquareButton>

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
            <hr className="my-2"></hr>
            {eraserButton}
            {undoButton}
            {redoButton}
        </div> 
    )
}

export default EditorLeftButtons