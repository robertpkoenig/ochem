import { ArrowLeftIcon } from "@heroicons/react/solid"
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
import ScreenWithLoading from "../../../components/ScreenWithLoading"

const panel = `rounded-md shadow p-5 bg-white flex items-center justify-between w-96`
const buttonGrid = `flex flex-row gap-2`
const squareButton = `text-white bg-indigo-600 rounded-md pointer w-8 h-8 flex justify-center items-center hover:bg-indigo-700 `
const selectedButton = squareButton + "bg-indigo-700 ring-2 ring-offset-2 ring-indigo-500 "
const buttonImage = "w-4 h-4"

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
}

class StudentReactionPage extends React.Component<IProps, IState> {

    db: FirebaseFirestore

    constructor(props: IProps) {

        super(props)

        this.db = getFirestore()

        this.state = {
            reaction: null,
            arrowType: null,
            loading: true
        }

    }

   
    async componentDidMount() {

        const docRef = doc(this.db, FirebaseConstants.REACTIONS, this.props.reactionId);
        const docSnap = await getDoc(docRef);

        const rawReactionObject = docSnap.data()

        const reaction = ReactionLoader.loadReactionFromObject(rawReactionObject)

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

    }

    arrowDrawnWrong() {
    }

    incrementStep() {
        const currentIndex = this.state.reaction.currentStep.order
        const nextIndex = currentIndex + 1
        this.state.reaction.currentStep = this.state.reaction.steps[nextIndex]
        this.forceUpdate()
    }

    render() {

        let listOfStepButtons: React.ReactNode
        if (this.state.reaction) {
            listOfStepButtons =   
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
                                                    <span className="w-full h-full rounded-full bg-indigo-200" />
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
            listOfStepButtons = "Loading"
        }
                                
        return (

            <ScreenWithLoading loading={this.state.loading}>
                <>
                <header className="bg-indigo-600">
                    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 ">
                        <div className="flex flex-col justify-left border-b border-indigo-400">

                            <Link href={"/editor/modules/" + this.state.reaction?.moduleId}>
                                <a className="text-indigo-200 hover:text-white text-xs font-light mt-3 mb-2 flex items-center gap-1">
                                <ArrowLeftIcon className="w-3 h-3" />
                                Module name goes here | Section name
                                </a>
                            </Link>


                            <div className="w-full flex flex-row justify-between mb-3">
                                <div>
                                    <h1 className="text-2xl font-semibold text-white">
                                        Reaction name goes here
                                    </h1>
                                </div>

                                <div className="flex flex-row gap-6 items-center">

                                    <button className="text-sm text-white">
                                        Something
                                    </button>

                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                <div className="min-h-screen bg-gray-100">
                    <div className="bg-indigo-600 pb-32">

                        <div className="py-5">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row gap-4 items-center text-white font-light">
                                Step prompt goes here giving student the context for the reaction
                            </div>
                        </div>
                    </div>
                
                    <main className="-mt-32">
                        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 flex flex-row gap-5">

                            {/* p5 canvas */}
                            <div id={Constants.CANVAS_PARENT_NAME} className="bg-white rounded-lg shadow flex-grow">
                                <div className="p-5 relative flex flex-row justify-between">
                                    <div className="flex flex-row items-center gap-2 text-sm text-gray-500">
                                        {listOfStepButtons}
                                    </div>
                                    <div className=" flex flex-row items-center gap-2 text-sm text-gray-500">
                                        {/* Double curly arrow */}
                                        <button
                                            className={this.state.arrowType == ArrowType.DOUBLE ? selectedButton : squareButton}
                                            onClick={() => this.setArrowType(ArrowType.DOUBLE)}
                                        >
                                            <img className={buttonImage} src="/assets/images/curly_arrows/double.svg" alt="double curly arrow"  />
                                        </button>

                                        {/* Single curly arrow */}
                                        <button
                                            className={this.state.arrowType == ArrowType.SINGLE ? selectedButton : squareButton}
                                            onClick={() => this.setArrowType(ArrowType.SINGLE)}

                                        >
                                            <img className={buttonImage} src="/assets/images/curly_arrows/single.svg" alt="single curly arrow" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        
                        </div>

                    </main>
                </div>
                </>
            </ScreenWithLoading>
        )
    }

}

export default StudentReactionPage
export { StudentReactionPage }