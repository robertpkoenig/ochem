import p5 from "p5";
import PanelController from "./controller/teacher/PanelController";

declare global {
	interface Window {
		panelController: PanelController
        p5: p5
	}
}