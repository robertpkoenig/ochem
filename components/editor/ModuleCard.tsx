import Link from "next/link"
import React from "react"
import ModuleListing from "../../model/ModuleListing"
import { primaryButtonMd, secondaryButtonMd } from "../../styles/common-styles"

const cardStyling = `flex flex-row space-between`

interface IProps {
    moduleListing: ModuleListing
}

function ModuleCard(props: IProps) {
    return (
        <div className="flex flex-row justify-between ">

            <div className="flex flex-col justify-center">
                {props.moduleListing.name}
            </div>

            <div className="flex flex-row gap-2">
                <Link href={"/viewer/modules/" + props.moduleListing.uuid}>
                    <a className={ secondaryButtonMd }>Preview</a>
                </Link>

                <Link href={"/editor/modules/" + props.moduleListing.uuid}>
                    <a className={ primaryButtonMd }>Edit</a>
                </Link>
            </div>
        </div>
    )
}

export default ModuleCard