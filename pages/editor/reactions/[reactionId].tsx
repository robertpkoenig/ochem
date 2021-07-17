import { NextRouter, withRouter } from "next/router"
import React from "react"
import LocalStorageReaction from "../../../model/LocalStorageReaction"
import ReactionEditor from "../../../p5/ReactionEditor"

interface WithRouterProps {
    router: NextRouter
}

interface IProps extends WithRouterProps {

}

interface IState {
    reaction: LocalStorageReaction | null
    reactionId: string
}

class ReactionEditor extends React.Component<IProps, IState> {

    constructor(props: IProps) {

        super(props)

        const reactionId = this.props.router.query.reactionId

        const dummyReaction: LocalStorageReaction = {
            name: "dummy",
            uuid: "dummy"
        }

        this.state = {
            reaction: dummyReaction,
            reactionId: reactionId as string,
        }

    }

   
    componentDidMount() {

        // Add logic to redirect if uuid of reaction is missing

        const moduleFromLocalStorageString: string | null = localStorage.getItem(this.state.reactionId)
        if (moduleFromLocalStorageString) {
            const reaction: LocalStorageReaction = JSON.parse(moduleFromLocalStorageString)

            this.setState({
                ...this.state,
                reaction: reaction
            })
        }



    }

    render() {
        return <ReactionEditor />
    }

}

export default withRouter(ReactionEditor)