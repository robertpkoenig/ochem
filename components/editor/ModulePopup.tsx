import React, { FormEventHandler, MouseEventHandler } from "react";
import { primaryButtonMd } from "../../styles/common-styles";

interface IProps {
    popopCloseFunction: FormEventHandler
    moduleAdditionFunction: (string: string) => void
}

interface State {
    moduleNameInput: string
}

class ModulePopup extends React.Component<IProps, State> {

    popupCloseFunction: FormEventHandler
    moduleAdditionFunction: (string: string) => void

    constructor(props: IProps) {

        super(props)
        this.popupCloseFunction = props.popopCloseFunction
        this.moduleAdditionFunction = props.moduleAdditionFunction

        this.state = {
            moduleNameInput: ""
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    onChange(event: React.FormEvent<HTMLInputElement>) {
        this.setState({ moduleNameInput: event.currentTarget.value });
    }

    onSubmit(event: React.FormEvent) {
        event.preventDefault();
        this.moduleAdditionFunction(this.state.moduleNameInput)
        this.popupCloseFunction(event)
    }

    render(): React.ReactNode {

        return (
            
            <form onSubmit={this.onSubmit}>
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="flex flex-col gap-6">

                    <div className="w-96">
                      <label htmlFor="module-name" className="block text-sm font-medium text-gray-700">
                        Module name
                      </label>
                      <input
                        type="text"
                        name="module-name"
                        value={this.state.moduleNameInput}
                        onChange={this.onChange}
                        id="module-name"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-100 text-right sm:px-6">
                  <input
                    type="submit"
                    name="Create Module"
                    placeholder="Type module name here"
                    className={primaryButtonMd + "cursor-pointer"}
                  />
                </div>
              </div>
            </form>

        )

    }

}

export default ModulePopup