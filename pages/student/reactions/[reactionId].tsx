import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid"
import Link from "next/link"
import React, { Fragment, useEffect, useState } from "react"
import { ArrowType } from "../../../canvas/model/chemistry/CurlyArrow"
import Reaction from "../../../canvas/model/Reaction"
import ReactionLoader from "../../../canvas/utilities/ReactionLoader"
import { GetServerSideProps } from 'next'
import UserType from "../../../canvas/model/UserType"
import { doc, FirebaseFirestore, getDoc, getFirestore } from "firebase/firestore"
import { Transition } from "@headlessui/react"
import ScreenWithLoadingAllRender from "../../../components/common/ScreenWithLoadingAllRender"
import p5 from "p5"
import { CANVAS_PARENT_NAME } from "../../../canvas/Constants"
import { REACTIONS } from "../../../persistence-model/FirebaseConstants"
import Button from "../../../components/common/buttons/Button"
import ShowIf from "../../../components/common/ShowIf"
import classNames from "../../../functions/helper/classNames"
import { Controller } from "../../../canvas/controller/Controller"

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
    successToastVis: boolean
    failureToastVis: boolean
    p5: p5
}

// This is page where a student uses a reaction exercise
function StudentReactionPage(props: IProps) {

    const db = getFirestore()

    const [loading, setLoading] = useState<boolean>(true)

    const [state, setState] = 
        useState<IStudentState>(() => (
            {
                reaction: null,
                arrowType: ArrowType.DOUBLE,
                successToastVis: false,
                failureToastVis: false,
                p5: null
            }))

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
            import("../../../canvas/TeacherP5Setup").then(module => {
                module.default(state, setP5, setController, UserType.STUDENT, state.reaction)
                setLoading(false)
            })
        }
        if (window && state.reaction && !state.p5) setupP5()
    }, [state.reaction])

    // Removes p5 object from window when component dismounts
    // double arrow function means function is called on dismount
    useEffect(() => () =>  state.p5?.remove(), [])

    function setP5(p5: p5) {
        setState({...state, p5: p5})
    }

    function setController(controller: Controller) {
        // This is not used, but is required to avoid having multiple verstions of sketch setup     
    }

    function setCurrentStep(stepUuid: string) {
        const selectedStep = state.reaction.steps.find(step => step.uuid === stepUuid)
        state.reaction.currentStep = selectedStep
        setState({...state, reaction: state.reaction})
    }

    function arrowDrawnSuccesfully() {
        incrementStep()
        if (state.reaction.currentStep.order == state.reaction.steps.length - 1) {
            setState({ ...state, arrowType: null })
        }
        toggleSuccessToast()
        setTimeout(toggleSuccessToast, 1000)
    }

    function toggleSuccessToast() {
        setState({ ...state, successToastVis: !state.successToastVis }) 
    }

    function toggleFailureToast() {
        setState({ ...state, failureToastVis: !state.failureToastVis }) 
    }

    function arrowDrawnWrong() {
        toggleFailureToast()
        setTimeout(toggleFailureToast, 1000)
    }

    // Advances to the next step in the reaction after
    // an arrow is drawn correctly in the current step
    function incrementStep() {
        const currentIndex = state.reaction.currentStep.order
        const nextIndex = currentIndex + 1
        state.reaction.currentStep = state.reaction.steps[nextIndex]
        setState({...state, reaction: state.reaction})
    }

    // This starts the exercise over
    function resetReaction() {
        state.reaction.currentStep = state.reaction.steps[0]
        setState({...state, reaction: state.reaction})
    }


    const progressIndicatorDots =   
            <div className="flex flex-row gap-3 ">
                <div className="text-xs font-medium">
                    Progress
                </div>
                <ol className="rounded-md flex gap-2 text-indigo-400 ">
                    {state.reaction?.steps.map(step => 
                        <li 
                            key={step.uuid}
                            className="relative flex items-center justify-center"
                        >
                            <ShowIf condition={step == state.reaction.currentStep}>
                                <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                                    <span className="w-full h-full rounded-full bg-indigo-200 animate-pulse" />
                                </span>
                            </ShowIf>

                            <span className={classNames("relative w-2.5 h-2.5 rounded-full", 
                                step.order > state.reaction.currentStep.order
                                    ? " bg-gray-300 " : "bg-indigo-600")} />
                        </li>
                    )}
                </ol>
            </div>

    const header = 
        <header className="bg-indigo-600">
            <div className="w-1200 mx-auto">
                <div className="flex flex-col justify-left border-b border-indigo-400">
                    <Link href={"/student/modules/" + state.reaction?.moduleId}>
                        <a className="text-indigo-200 hover:text-white text-xs font-light mt-3 mb-2 flex items-center gap-1">
                        <ArrowLeftIcon className="w-3 h-3" />
                            {state.reaction?.moduleName + " | " + state.reaction?.sectionName}
                        </a>
                    </Link>
                    <div className="w-full flex flex-row justify-between mb-3">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">
                                { state.reaction?.name }
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </header>   
        
    const stepPrompt =
        <div className="bg-indigo-600 pb-32">
            <div className="py-5">
                <div className="w-1200 mx-auto flex flex-row gap-4 items-center text-white font-light">
                    {state.reaction?.prompt}
                </div>
            </div>
        </div>
    
    const invisibleDivToBlockCanvasWhenFinishedExcercise =
        <div className="z-20 h-full absolute bg-black w-1200 rounded-md" />
        
    const correctArrowNotification = 
        <Transition
            show={state.successToastVis}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="ml-2 bg-green-200 py-1.5 pl-3 pr-4 flex flex-row gap-2 justify-center rounded-md">
                <div>
                    <CheckCircleIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-green-600">Correct arrow</h3>
                </div>
            </div>
        </Transition>    
        
    const wrongArrowNotification =
        <div className="absolute bottom-0 bg-pink-200 p-2 flex flex-row justify-center w-full rounded-b-md ">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-pink-600">Incorrect arrow</h3>
                </div>
            </div>
        </div>

    const excerciseFinishedNotification =
        <div className="absolute bottom-0 bg-green-50 p-4 flex flex-row items-center justify-between w-full rounded-b-md ">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-600">Reaction completed!</h3>
                </div>
            </div>
            <div className="flex flex-row gap-4">

                <Button
                    size={'small'}
                    importance={'secondary'}
                    text={'Retry'}
                    icon={null}
                    onClick={resetReaction}
                    extraClasses={''}
                />

                <Link href={"/student/modules/" + state.reaction?.moduleId}>
                    <a>
                        <Button
                            size={'small'}
                            importance={'primary'}
                            text={'Back to module'}
                            icon={null}
                            onClick={null}
                            extraClasses={''}
                        />
                    </a>
                </Link>

            </div>
        </div>
                                
    return (
        <ScreenWithLoadingAllRender loading={loading}>
            <Fragment>
                {header}
                <div className="min-h-screen bg-gray-100">
                    {stepPrompt}
                    <main className="-mt-32">
                        <div className="w-1200 h-700 mx-auto pb-12 flex flex-row gap-5">
                            {/* p5 canvas */}
                            <div id={CANVAS_PARENT_NAME} className="bg-white h-700 rounded-lg shadow flex-grow relative">

                                <ShowIf condition={state.reaction?.currentStep.order == state.reaction?.steps.length - 1}>
                                    {invisibleDivToBlockCanvasWhenFinishedExcercise}
                                </ShowIf>

                                <div className="w-1200 p-5 absolute flex flex-row justify-between">
                                    <div className="flex flex-row items-center gap-2 text-sm text-gray-500">
                                        {progressIndicatorDots}
                                        {correctArrowNotification}
                                    </div>
                                </div>

                                <ShowIf condition={state.failureToastVis}>
                                    {wrongArrowNotification}
                                </ShowIf>

                                <ShowIf condition={state.reaction?.currentStep.order == state.reaction?.steps.length - 1}>
                                    {excerciseFinishedNotification}
                                </ShowIf>

                            </div>
                        </div>
                    </main>
                </div>
            </Fragment>
        </ScreenWithLoadingAllRender>
    )

}

export type { IStudentState }
export default StudentReactionPage