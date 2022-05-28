import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid"
import Link from "next/link"
import React from "react"
import { ArrowType } from "../../../canvas/model/chemistry/CurlyArrow"
import Reaction from "../../../canvas/model/Reaction"
import ReactionStep from "../../../canvas/model/ReactionStep"
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

const panel = `rounded-md shadow p-5 bg-white flex items-center justify-between w-96`
const buttonGrid = `flex flex-row gap-2`
const squareButton = `text-white bg-indigo-600 rounded-md pointer w-8 h-8 flex justify-center items-center hover:bg-indigo-700 `
const selectedButton = squareButton + "bg-indigo-700 ring-2 ring-offset-2 ring-indigo-500 "
const buttonImage = "w-4 h-4"

// Gets the reaction Id from the URL path when the page
// is request on the server
export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            reactionId: context.params.reactionId
        }, // will be passed to the page component as props
    }
}

interface IProps {
    reactionId: string
}

interface IState {
    reaction: Reaction | null
    arrowType: ArrowType | null
    loading: boolean
    successToastVis: boolean
    failureToastVis: boolean
    p5: p5
}

// This is page where a student uses a reaction exercise
class StudentReactionPage extends React.Component<IProps, IState> {

    db: FirebaseFirestore

    constructor(props: IProps) {

        super(props)

        this.db = getFirestore()

        this.state = {
            reaction: null,
            arrowType: ArrowType.DOUBLE,
            loading: true,
            successToastVis: false,
            failureToastVis: false,
            p5: null
        }

    }
   
    // When the component is loaded into the browser window,
    // the reaction JSON is retreieved from the database, and
    // is deserialized to a Reaction object
    async componentDidMount() {

        const docRef = doc(this.db, REACTIONS, this.props.reactionId);
        const docSnap = await getDoc(docRef);

        const rawReactionObject = docSnap.data()

        const reaction = ReactionLoader.loadReactionFromObject(rawReactionObject)
        reaction.currentStep = reaction.steps[0]

        this.setState({
            ...this.state,
            reaction: reaction
        })

        // Create the p5 element
        let createP5StudentContext
        if (window) {
            const createP5Context = (await import("../../../canvas/Sketch")).default
            createP5Context(this, UserType.STUDENT, reaction)

            if (!reaction)
            throw new Error("reaction not loaded")

            this.setState({
                ...this.state,
                loading: false
            })
        }

    }

    // This is used by the p5 setup function to inject the p5
    // instance into this component's state
    setP5(p5: p5) {
        this.setState(
            {
               ...this.state,
               p5: p5
            }
        )
    }

    // This function is called when this component is removed
    // from the browser window. It removes the p5 object from
    // the window, and therefore stops the p5 draw loop.
    componentWillUnmount() {
        this.state.p5.remove()
    }

    setArrowType(arrowType: ArrowType) {

        if (this.state.arrowType == arrowType) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    arrowType: null
                }
            })  
        }

        else {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    arrowType: arrowType,
                    bondType: null,
                    eraserOn: false
                }
            }) 
        }
       
    }

    setCurrentStep(stepId: string) {
        let selectedStep: ReactionStep
        for (const step of this.state.reaction.steps) {
            if (step.uuid == stepId) selectedStep = step
        }
        this.state.reaction.currentStep = selectedStep
    }

    arrowDrawnSuccesfully() {
        this.incrementStep()
        if (this.state.reaction.currentStep.order == this.state.reaction.steps.length - 1) {
            this.setState(prevState => {
                return {
                    ...prevState,
                    arrowType: null
                }
            })
        }
        this.toggleSuccessToast()
        setTimeout(this.toggleSuccessToast.bind(this), 1000)
    }

    toggleSuccessToast() {
        this.setState(prevState => {
            return {
                ...prevState,
                successToastVis: !prevState.successToastVis
            }
        }) 
    }

    toggleFailureToast() {
        this.setState(prevState => {
            return {
                ...prevState,
                failureToastVis: !prevState.failureToastVis
            }
        }) 
    }

    arrowDrawnWrong() {
        this.toggleFailureToast()
        setTimeout(this.toggleFailureToast.bind(this), 1000)
    }

    // Advances to the next step in the reaction after
    // an arrow is drawn correctly in the current step
    incrementStep() {
        const currentIndex = this.state.reaction.currentStep.order
        const nextIndex = currentIndex + 1
        this.state.reaction.currentStep = this.state.reaction.steps[nextIndex]
        this.forceUpdate()
    }

    // This starts the exercise over
    resetReaction() {
        this.state.reaction.currentStep = this.state.reaction.steps[0]
        this.forceUpdate()
    }

    render() {

        // The circles which represent the user's progress in the application
        let stepIndicators: React.ReactNode
        if (this.state.reaction) {
            stepIndicators =   
                <div className="flex flex-row gap-3 ">
                    <div className="text-xs font-medium">
                        Progress
                    </div>
                    <ol className="rounded-md flex gap-2 text-indigo-400 ">
                        {
                        this.state.reaction.steps.map(step => (

                            <li 
                                key={step.uuid}
                                className="relative flex items-center justify-center"
                            >
                                {
                                step === this.state.reaction.currentStep
                                ?
                                <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                                    <span className="w-full h-full rounded-full bg-indigo-200 animate-pulse" />
                                </span>
                                :
                                null
                                }

                                <span className={"relative w-2.5 h-2.5 rounded-full  " +
                                (step.order > this.state.reaction.currentStep.order
                                    ? " bg-gray-300 " : "bg-indigo-600")} />
                                
                            </li>
                        ))
                        }
                    </ol>
                </div>
        }
        else {
            stepIndicators = "Loading"
        }
                                
        return (

            <ScreenWithLoadingAllRender loading={this.state.loading}>
                <>
                {/* Header above thin white line */}
                <header className="bg-indigo-600">
                    <div className="w-1200 mx-auto">
                        <div className="flex flex-col justify-left border-b border-indigo-400">

                            <Link href={"/student/modules/" + this.state.reaction?.moduleId}>
                                <a className="text-indigo-200 hover:text-white text-xs font-light mt-3 mb-2 flex items-center gap-1">
                                <ArrowLeftIcon className="w-3 h-3" />
                                    {
                                        this.state.reaction
                                        ?
                                        this.state.reaction.moduleName + " | " + this.state.reaction.sectionName
                                        :
                                        null
                                    }
                                </a>
                            </Link>

                            <div className="w-full flex flex-row justify-between mb-3">
                                <div>
                                    <h1 className="text-2xl font-semibold text-white">
                                        {
                                            this.state.reaction
                                            ?
                                            this.state.reaction.name
                                            :
                                            null
                                        }
                                    </h1>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                <div className="min-h-screen bg-gray-100">
                    
                    <div className="bg-indigo-600 pb-32">

                        {/* Step prompt container */}
                        {
                            this.state.reaction && this.state.reaction.prompt
                            ?
                            <div className="py-5">
                                <div className="w-1200 mx-auto flex flex-row gap-4 items-center text-white font-light">
                                    {this.state.reaction.prompt}
                                </div>
                            </div>
                            :
                            <div className="h-5"></div>
                        }

                    </div>
                
                    <main className="-mt-32">
                        <div className="w-1200 h-700 mx-auto pb-12 flex flex-row gap-5">

                            {/* p5 canvas */}
                            <div id={CANVAS_PARENT_NAME} className="bg-white h-700 rounded-lg shadow flex-grow relative">
                                {
                                    this.state.reaction &&
                                    this.state.reaction.currentStep.order == this.state.reaction.steps.length - 1
                                    ?
                                    <div className="z-20 h-96 absolute bg-white bg-opacity-0 w-1200 rounded-md" />
                                    :
                                    null
                                }
                                    
                                <div className="w-1200 p-5 absolute flex flex-row justify-between">
                                    <div className="flex flex-row items-center gap-2 text-sm text-gray-500">
                                        {stepIndicators}
                                        <Transition
                                            show={this.state.successToastVis}
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
                                    </div>
                                </div>

                                {/* Wrong arrow notification on bottom of screen */}
                                {
                                    this.state.failureToastVis
                                    ?
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
                                    :
                                    null
                                }

                                <ShowIf condition={this.state.reaction?.currentStep.order == this.state.reaction?.steps.length - 1}>
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
                                                onClick={this.resetReaction.bind(this)}
                                                extraClasses={''}
                                            />

                                            <Link href={"/student/modules/" + this.state.reaction?.moduleId}>
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
                                </ShowIf>

                            </div>
                        
                        </div>

                    </main>
                
                </div>

                </>
            </ScreenWithLoadingAllRender>
        )
    }

}

export default StudentReactionPage
export { StudentReactionPage }