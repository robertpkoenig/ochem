import p5 from "p5";
import { Vector } from "sat";
import CollisionDetector from "../../view/CollisinDetector";
import Reaction from "../../model/Reaction";
import CurlyArrowCreator from "../CurlyArrowCreator";
import AtomMover from "../teacher/helper/AtomMover";
import HoverDetector from "../teacher/helper/HoverDetector";
import { IStudentState } from "../../../pages/student/reactions/[reactionId]";
import { TemporaryProcess, temporaryProcesses } from "../delayedActions";
import {
  addArrowToListOfCurlyArrows,
  clearCurlyArrows,
  curlyArrows,
  removeArrowFromCurlyArrows,
} from "../../view/curlyArrows";
import {
  addToFeedbackItems,
  CorrectArrowFeedback,
  IncorrectArrowFeedback,
  removeFromFeedbackItems,
} from "../../view/feedback";
import { FRAME_RATE } from "../../Constants";
import { Atom } from "../../model/chemistry/atoms/Atom";

/** Handles student input in canvas */
class StudentController {
  // Upstream objects
  p5: p5;
  reaction: Reaction;
  collisionDetector: CollisionDetector;
  hoverDetector: HoverDetector;
  curlyArrowCreator: CurlyArrowCreator;
  bodyMover: AtomMover;

  // React page state
  pageState: IStudentState;

  // Functions from the react page that trigger notifications to user
  setPageState: React.Dispatch<React.SetStateAction<IStudentState>>;

  constructor(
    p5: p5,
    reaction: Reaction,
    collisionDetector: CollisionDetector,
    pageState: IStudentState,
    setPageState: React.Dispatch<React.SetStateAction<IStudentState>>
  ) {
    this.p5 = p5;
    this.reaction = reaction;
    this.collisionDetector = collisionDetector;
    this.pageState = pageState;
    this.setPageState = setPageState;

    this.hoverDetector = new HoverDetector(reaction, collisionDetector);
    this.curlyArrowCreator = new CurlyArrowCreator(
      reaction,
      this.hoverDetector,
      pageState,
      null
    ); // no undo for student
  }

  process() {
    for (const curlyArrow of this.reaction.currentStep.curlyArrows) {
      // if there is a curly arrow present
      curlyArrow.update(this.p5, this.reaction.zoom);
    }
    // TODO change this update function to sit with the arrowCreator
    if (this.curlyArrowCreator.draftArrow != null) {
      this.curlyArrowCreator.draftArrow.update(this.p5, this.reaction.zoom);
    }
    this.updateMouseStyle();
    this.hoverDetector.detectHovering();
  }

  routeMousePressed(mouseVector: Vector) {
    if (this.pageState.arrowType != null) {
      this.curlyArrowCreator.startArrowIfObjectClicked();
    }
  }

  routeMouseReleased(mouseVector: Vector) {
    if (this.curlyArrowCreator.draftArrow != null) {
      this.testStudentArrowIfCompleted();
    }
  }

  // Updates the mouse style based on what the mouse is hovering
  updateMouseStyle() {
    const currentlyOverAtom = this.hoverDetector.atomCurrentlyHovered != null;
    const currentlyOverBond = this.hoverDetector.bondCurrentlyHovered != null;
    const currentlyOverLonePair =
      this.hoverDetector.lonePairCurrentlyHovered != null;
    const currentlyOverIon = this.hoverDetector.ionCurrentlyHovered != null;

    const currentlyDrawingArrow = this.curlyArrowCreator.draftArrow != null;

    if (
      currentlyOverBond ||
      currentlyOverAtom ||
      currentlyOverLonePair ||
      currentlyDrawingArrow ||
      currentlyOverIon
    ) {
      this.p5.cursor("crosshair");
    } else {
      this.p5.cursor(this.p5.ARROW);
    }
  }

  /** Once the student draws their arrow, test that it is correct */
  testStudentArrowIfCompleted() {
    const nextCurlyArrowIndex = curlyArrows.length;
    const nextCurlyArrow =
      this.reaction.currentStep.curlyArrows[nextCurlyArrowIndex];
    this.curlyArrowCreator.completeStudentArrowIfReleasedOverObject();
    const reaction = this.reaction;
    const correctArrow = this.curlyArrowCreator.draftArrow;

    const nextStep = reaction.steps[reaction.currentStep.order + 1];

    const positionOfAtomsInNextStep: { [atomUid: string]: Vector } = {};

    for (const molecule of nextStep.molecules) {
      for (const atom of molecule.atoms) {
        positionOfAtomsInNextStep[atom.uuid] = atom.getPosVector().clone();
      }
    }

    function moveAtoms() {
      for (const molecule of reaction.currentStep.molecules) {
        for (const atom of molecule.atoms) {
          const positionOfAtomInNextStep = positionOfAtomsInNextStep[atom.uuid];

          // Get the positions of the two atoms
          const posOne = atom.getPosVector();
          const posTwo = positionOfAtomInNextStep;

          // Calculate the distance between the two points
          const distanceVector = posOne.clone().sub(posTwo);

          const distanceVectorScaledToDifference = distanceVector.scale(0.08);

          atom.getPosVector().sub(distanceVectorScaledToDifference);
        }
      }
    }

    function changeAtomPositionsInNextStepToMatchCurrentStep() {
      for (const molecule of nextStep.molecules) {
        for (const atom of molecule.atoms) {
          const correspondingAtomInCurrentStep = reaction.currentStep
            .getAllAtoms()
            .find((a) => a.uuid == atom.uuid);
          atom.circle.pos = correspondingAtomInCurrentStep.getPosVector();
        }
      }
    }

    const animateAtomsProcess: TemporaryProcess = {
      functionCalledEachFrame: function () {
        moveAtoms();
      },
      functionCalledAtEnd: function (): void {},
      remainingFramesBeforeActionExecuted: 3000,
    };

    function addAnimationToTempProcesses() {
      temporaryProcesses.push(animateAtomsProcess);
    }

    if (this.curlyArrowCreator.draftArrow != null) {
      const curlyArrowIsCorrect =
        this.curlyArrowCreator.draftArrow.startObject ===
          nextCurlyArrow.startObject &&
        this.curlyArrowCreator.draftArrow.endObject ===
          nextCurlyArrow.endObject;
      if (curlyArrowIsCorrect) {
        addArrowToListOfCurlyArrows(this.curlyArrowCreator.draftArrow);
        const correctArrowFeedback = new CorrectArrowFeedback(
          this.curlyArrowCreator.draftArrow,
          this.p5
        );
        addToFeedbackItems(correctArrowFeedback);
        temporaryProcesses.push({
          functionCalledEachFrame: () => {},
          functionCalledAtEnd: () => {
            removeFromFeedbackItems(correctArrowFeedback);
            if (
              curlyArrows.length == this.reaction.currentStep.curlyArrows.length
            ) {
              curlyArrows.length = 0;
              changeAtomPositionsInNextStepToMatchCurrentStep();
              reaction.currentStep =
                reaction.steps[reaction.currentStep.order + 1];
              this.setPageState({ ...this.pageState });
              addAnimationToTempProcesses();
            }
          },
          remainingFramesBeforeActionExecuted: 1000 / FRAME_RATE,
        });
      } else {
        const incorrectArrow = this.curlyArrowCreator.draftArrow;
        incorrectArrow.correct = false;
        addArrowToListOfCurlyArrows(this.curlyArrowCreator.draftArrow);
        const incorrectArrowFeedback = new IncorrectArrowFeedback(
          this.curlyArrowCreator.draftArrow,
          this.p5
        );
        addToFeedbackItems(incorrectArrowFeedback);
        temporaryProcesses.push({
          functionCalledEachFrame: function () {},
          functionCalledAtEnd: function () {
            removeFromFeedbackItems(incorrectArrowFeedback);
            removeArrowFromCurlyArrows(incorrectArrow);
          },
          remainingFramesBeforeActionExecuted: 1000 / FRAME_RATE,
        });
      }
    }
    this.curlyArrowCreator.draftArrow = null;
    if (
      this.curlyArrowCreator.draftArrow != null &&
      this.curlyArrowCreator.draftArrow.startObject ===
        nextCurlyArrow.startObject &&
      this.curlyArrowCreator.draftArrow.endObject === nextCurlyArrow.endObject
    ) {
      // addDelayedAction(() => console.log("delayedActiontriggered"), 1000)
    } else if (
      this.curlyArrowCreator.draftArrow != null &&
      this.curlyArrowCreator.draftArrow.endObject != null
    ) {
      // todo
      this.curlyArrowCreator.draftArrow = null;
    }
    this.curlyArrowCreator.draftArrow = null;
  }

  animateMovementOfAtomsFromOneStepToNext() {}

  moveToNextStepIfReady() {
    if (curlyArrows.length == this.reaction.currentStep.curlyArrows.length) {
      clearCurlyArrows();
      const currentStepIndex = this.pageState.reaction.currentStep.order;
      this.pageState.reaction.currentStep =
        this.pageState.reaction.steps[currentStepIndex + 1];
      this.setPageState({ ...this.pageState, numCorrectArrows: 0 });
    } else {
      this.setPageState({
        ...this.pageState,
        numCorrectArrows: this.pageState.numCorrectArrows + 1,
      });
    }
  }
}

export default StudentController;
