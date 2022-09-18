import React, { Fragment as div, useContext, useEffect, useState } from "react"
import { ArrowType } from "../../../canvas/model/chemistry/CurlyArrow"
import Reaction from "../../../canvas/model/Reaction"
import ReactionLoader from "../../../canvas/utilities/ReactionLoader"
import { GetServerSideProps } from 'next'
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import ScreenWithLoadingAllRender from "../../../components/common/ScreenWithLoadingAllRender"
import p5 from "p5"
import { CANVAS_PARENT_NAME } from "../../../canvas/Constants"
import { REACTIONS } from "../../../persistence-model/FirebaseConstants"
import Show from "../../../components/common/Show"
import ProgressIndicators from "../../../components/student/reaction/ProgressIndicators"
import ExcerciseFinishedNotification from "../../../components/student/reaction/ExcerciseFinishedNotification"
import CorrectArrowNotification from "../../../components/student/reaction/CorrectArrowNotification"
import StudentReactionHeader from "../../../components/student/reaction/StudentReactionHeader"
import StudentController from "../../../canvas/controller/student/StudentController"
import { ExclamationCircleIcon } from "@heroicons/react/solid"
import { AuthContext } from "../../../context/authContext"
import HelpPopup from "../../../components/student/reaction/HelpPopup"

// Gets the reaction Id from the URL path during server side rendering
export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            reactionId: context.params.reactionId
        }, // will be passed to the page component as prop
    }
}

interface IProps {
    reactionId: string
}

interface IStudentState {
    reaction: Reaction | null
    arrowType: ArrowType | null
    numCorrectArrows: number
    p5: p5
    controller: StudentController | null
}

// This is page where a student uses a reaction exercise
function StudentReactionPage(props: IProps) {


    const { user } = useContext(AuthContext)

    const db = getFirestore()

    const [ loading, setLoading ] = useState<boolean>(true)
    const [ introPopupVis, setIntroPopupVis ] = useState<boolean>(false)

    const [state, setState] = 
        useState<IStudentState>(() => (
          {
            reaction: null,
            arrowType: ArrowType.DOUBLE,
            numCorrectArrows: 0,
            p5: null,
            controller: null
          }))

    // Removes p5 object from window when component dismounts
    // double arrow function means function is called on dismount
    useEffect(() => () =>  state.p5?.remove(), [])

    useEffect(() => {
        // load reaction from db
        getDoc(doc(db, REACTIONS, props.reactionId))
        .then(doc => {
            const reaction = ReactionLoader.loadReactionFromObject(doc.data())
            setState({...state, reaction: reaction})
        })
    }, [db, props.reactionId])

    useEffect(() => {
        // Instantiate p5 in browser (not possible serverside)
        async function setupP5() {
            import("../../../canvas/StudentP5Setup").then(module => {
                module.default(state, setState, state.reaction)
                setLoading(false)
            })
        }
        if (window && state.reaction && !state.p5) setupP5()
    }, [state.reaction])

    useEffect(() => {
      if (state.controller) {    
          state.controller.pageState = state;
      }
    }, [state])

    useEffect(() => {
      if (user && "introPopupSeen" in user && !user.introPopupSeen) {
        toggleIntroPopup()
        const docRef = doc(db, "users", user.userId);
        updateDoc(docRef, {
          introPopupSeen: true
        })
      }
    })

    // This starts the exercise over
    function resetReaction() {
        state.reaction.currentStep = state.reaction.steps[0]
        setState({...state, reaction: state.reaction})
    }
    
    const reactionComplete = state.reaction?.currentStep == state.reaction?.steps.at(-1)

    function toggleIntroPopup() {
      setIntroPopupVis(!introPopupVis)
    }

    const progressBar = 
        <div className="w-full p-5 absolute flex justify-between gap-3">
            <div className="flex flex-row items-center gap-2 text-sm text-gray-500">
                <ProgressIndicators reaction={state.reaction} />
            </div>
            <Show if={state.reaction?.currentStep.curlyArrows.length > 1} >
              <div className="flex gap-1 px-2 py-1 bg-orange-300 text-orange-700 text-xs rounded">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  This step requires more than one arrow
              </div>
            </Show >
        </div>

    return (
        <ScreenWithLoadingAllRender loading={loading}>
            <div className="bg-gray-100">
              <StudentReactionHeader
                reaction={state.reaction}
                togglePopup={toggleIntroPopup}
              />
              <div className="min-h-screen">
                <main className="">
                  <div className="w-1200 h-700 mx-auto pb-12 flex flex-row gap-5">
                    <Show if={introPopupVis}>
                      <HelpPopup reaciton={state.reaction} togglePopup={toggleIntroPopup} />
                    </Show>
                    {/* p5 canvas */}
                    <div id={CANVAS_PARENT_NAME} className="bg-white h-700 rounded-lg shadow flex-grow relative">

                      <Show if={!reactionComplete}>
                        {progressBar}
                      </Show>

                      <Show if={reactionComplete}>
                          <ExcerciseFinishedNotification
                              reaction={state.reaction}
                              resetReaction={resetReaction}
                          />
                      </Show>

                    </div>
                  </div>
                </main>
              </div>
            </div>
        </ScreenWithLoadingAllRender>
    )

}

export type { IStudentState }
export default StudentReactionPage