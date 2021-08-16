import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid"
import Link from "next/link"
import React from "react"
import { ArrowType } from "../../../p5/model/chemistry/CurlyArrow"
import Reaction from "../../../p5/model/Reaction"
import ReactionStep from "../../../p5/model/ReactionStep"
import ReactionLoader from "../../../p5/utilities/ReactionLoader"
import { GetServerSideProps } from 'next'
import Constants from "../../../p5/Constants"
import UserType from "../../../p5/model/UserType"
import { doc, FirebaseFirestore, getDoc, getFirestore } from "firebase/firestore"
import FirebaseConstants from "../../../model/FirebaseConstants"
import { findConfigFile } from "typescript"
import { primaryButtonSm, secondaryButtonSm } from "../../../styles/common-styles"
import { Transition } from "@headlessui/react"
import ScreenWithLoadingAllRender from "../../../components/ScreenWithLoadingAllRender"
import p5 from "p5"

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
            arrowType: null,
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

        const docRef = doc(this.db, FirebaseConstants.REACTIONS, this.props.reactionId);
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
            const createP5Context = (await import("../../../p5/Sketch")).default
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
                        Step 
                        {" " + (this.state.reaction.currentStep.order + 1)} of 
                            {" " + this.state.reaction.steps.length}
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
                            <div id={Constants.CANVAS_PARENT_NAME} className="bg-white h-700 rounded-lg shadow flex-grow relative">
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
                                    <div className="flex flex-row items-center gap-2 text-sm text-gray-500">
                                        {/* Double curly arrow */}
                                        <button
                                            className={this.state.arrowType == ArrowType.DOUBLE ? selectedButton : squareButton}
                                            onMouseDown={() => this.setArrowType(ArrowType.DOUBLE)}
                                        >
                                            <img className={buttonImage} src="/assets/images/curly_arrows/double.svg" alt="double curly arrow"  />
                                        </button>

                                        {/* Single curly arrow */}
                                        <button
                                            className={this.state.arrowType == ArrowType.SINGLE ? selectedButton : squareButton}
                                            onMouseDown={() => this.setArrowType(ArrowType.SINGLE)}
                                        >
                                            <img className={buttonImage} src="/assets/images/curly_arrows/single.svg" alt="single curly arrow" />
                                        </button>
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

                                {/* Wrong arrow notification on bottom of screen */}
                                {
                                    this.state.reaction &&
                                    this.state.reaction.currentStep.order == this.state.reaction.steps.length - 1
                                    ?
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
                                            <button className={secondaryButtonSm} onMouseDown={this.resetReaction.bind(this)}>
                                                Retry
                                            </button>

                                            <Link href={"/student/modules/" + this.state.reaction?.moduleId}>
                                                <a className={primaryButtonSm}>
                                                    Back To Module
                                                </a>
                                            </Link>
                                        </div>
                                    </div>
                                    :
                                    null
                                }

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