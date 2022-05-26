import { MinusCircle, PlusCircle, RotateCcw, RotateCw } from "react-feather";
import Ion from "../../canvas/model/chemistry/atoms/Ion";
import BondType from "../../canvas/model/chemistry/bonds/BondType";
import { ArrowType } from "../../canvas/model/chemistry/CurlyArrow";
import SquareButton from "../common/buttons/SquareButton";

interface IProps {
    bondType: BondType,
    setBondType: (bondType: BondType) => void,
    arrowType: ArrowType,
    setArrowType: (arrowType: ArrowType) => void,
    straightArrowSelected: boolean,
    toggleStraightArrowSelected: () => void,
    selectedIon: Ion,
    selectIon: (selectedIon: Ion) => void,
    eraserOn: boolean,
    toggleEraser: () => void,
    undo: () => void,
    redo: () => void,
}

function EditorLeftButtons(props: IProps) {

    // Functions to make it easier to change to React.Context logic later
    function setBondType(bondType: BondType) {
        props.setBondType(bondType)
    }
    function setArrowType(arrowType: ArrowType) {
        props.setArrowType(arrowType)
    }
    function toggleStraightArrow() {
        props.toggleStraightArrowSelected()
    }
    function selectIon(ion: Ion) {
        props.selectIon(ion)
    }
    function toggleEraser() {
        props.toggleEraser()
    }
    function undo() {
        props.undo()
    }
    function redo() {
        props.redo()
    }

    const bondTypeButtons = 
        Object.values(BondType).map(bondType => {
            return (
                <SquareButton
                    key={bondType} 
                    imageSrc={"/assets/images/bonds/" + bondType + ".svg"} 
                    imageAltText={bondType + " bond"} 
                    onMouseDown={() => setBondType(bondType)} 
                    selected={props.bondType === bondType}
                />
            )
        })

    const doubleCurlyArrowButton =
        <SquareButton
            imageSrc={"/assets/images/curly_arrows/double.svg"} 
            imageAltText={"double curly arrow"} 
            onMouseDown={() => setArrowType(ArrowType.DOUBLE)}
            selected={props.arrowType == ArrowType.DOUBLE}
        />

    const straightArrowButton =
        <SquareButton
            imageSrc={"/assets/images/straight-arrow.svg"} 
            imageAltText={"straight arrow"} 
            onMouseDown={toggleStraightArrow}
            selected={props.straightArrowSelected}
        />

    const selectCationButton =
        <SquareButton
            onMouseDown={() => selectIon(Ion.CATION)}
            selected={props.selectedIon ==  Ion.CATION}
        >
            <PlusCircle className="w-4 h-4" />
        </SquareButton> 

    const selectAnionButton =
        <SquareButton
            onMouseDown={() => selectIon(Ion.ANION)}
            selected={props.selectedIon ==  Ion.ANION}
        >
            <MinusCircle className="w-4 h-4" />
        </SquareButton>
    
    const eraserButton =
        <SquareButton
            imageSrc={"/assets/images/eraser.svg"} 
            imageAltText={"eraser"} 
            onMouseDown={toggleEraser}
            selected={props.eraserOn}
        />

    const undoButton = 
        <SquareButton
            onMouseDown={() => undo()}
            selected={false}
        >
            <RotateCcw className="w-3.5 h-3.5"/>
        </SquareButton>

    const redoButton =
        <SquareButton
            onMouseDown={() => redo()}
            selected={false}
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