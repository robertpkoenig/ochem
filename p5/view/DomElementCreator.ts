import { AtomicElements } from "../model/chemistry/atoms/elements";
import BondType from "../model/chemistry/bonds/BondType";
import Reaction from "../model/Reaction";

class DomElementCreator {

    public static populateEditorPanel() {
        this.createEditorPanelElements()
        this.createBondTypeSelectors()
    }

    private static createEditorPanelElements() {

        let elementListHTML = ""

        for (const key in AtomicElements) {
            const color = AtomicElements[key].color
            const abbreviation = AtomicElements[key].abbreviation
            const atomDivHtml = `
                <div class="atom-container">
                
                <div id="${key}"
                        class="atom"
                        style="background-color: ${color}"
                        onmousedown="window.panelController.selectElement('${key}')"
                        onmouseup="window.panelController.dropElement('${key}')"
                        onselectstart="return false"
                        >${abbreviation}</div>

                </div>  
            `
            // elementList.html(atomDivHtml, true)
            elementListHTML += atomDivHtml
        }

        const elementGrid = document.getElementById("element-grid")

        if (elementGrid == null) {
            throw new Error("element grid DOM element not found")
        }

        elementGrid.innerHTML = elementListHTML

    }

    private static createBondTypeSelectors() {

        let bondSelectorHTML = ""

        for (const key in BondType) {

            const bondTypeSelectorButtonHTML = `
                <button id="${key}"
                        class="r-flex v-center h-center square-button"
                        onClick="window.panelController.selectBondType('${key}')"
                        >
                            <img    src="/assets/images/bonds/${key}.svg"
                                    alt="${key} bond"
                                    class="button-image">
                </button>
            `

            bondSelectorHTML += bondTypeSelectorButtonHTML

        }

        const bondGrid = document.getElementById("bond-grid")

        if (bondGrid == null) {
            throw new Error("bond grid DOM element not found")
        }

        bondGrid.innerHTML = bondSelectorHTML

    }

    public static setStateCards(reaction: Reaction) {

        let stateSelectorListHTML = ""

        for (const reactionStep of reaction.steps) {
            stateSelectorListHTML += 
            `
                <div 
                    class="state-card h-space-between"
                    onclick="window.panelController.setCurrentState('${reactionStep.id}')"
                >
                    <div class="r-flex gap5 v-center">
                        <div id="step-indicator-${reactionStep.id}" class="active-step-indicator" style="display: none"></div>
                        ${reactionStep.name != null ? reactionStep.name : "New step"}
                    </div>
                    <div class="r-flex v-center">
                        <i class="dots feather-more-vertical"></i>
                    </div>
                </div>
            `
        }

        const listOfSteps = document.getElementById("list-of-steps")

        if (listOfSteps == null) {
            throw new Error("list of steps DOM element not found")
        }

        listOfSteps.innerHTML = stateSelectorListHTML

    }

}

export default DomElementCreator