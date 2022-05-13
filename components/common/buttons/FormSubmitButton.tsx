import classNames from "../../../functions/helper/classNames"

interface IProps {
    value: string,
    class: string
}

function FormSubmitButton(props: IProps) {
    return (
        <input
            type="submit"
            value={props.value}
            className={classNames(props.class, "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:bg-indigo-200  disabled:cursor-default")}
        />
    )
}

export default FormSubmitButton