import p5 from "p5";
import PanelController from "./controller/editor/PanelController";

declare global {
	interface Window {
		panelController: PanelController
        p5: p5
	}
}