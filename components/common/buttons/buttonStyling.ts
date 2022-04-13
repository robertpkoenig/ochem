type Size = "medium" | "small";
type Importance = "primary" | "secondary" | "caution"

type SizeStyle = {
    [key in Size]: string
} 

const sizeStyles: SizeStyle = {
    small: "px-3  py-1.5  text-xs font-medium rounded",
    medium: "px-4 py-2 text-sm rounded-md"
}

type IconSizeStyle = {
    [key in Size]: string
}

const iconSizeStyle: IconSizeStyle = {
    small: "-ml-0.5 h-4 w-4",
    medium: "-ml-0.5 mr-2 h-5 w-5"
}

type ImportanceStyles = {
    [key in Importance]: string
}

const importanceStyles: ImportanceStyles = {
    primary: "white text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200",
    secondary: "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:text-indigo-300",
    caution: "text-red-700 bg-red-100 hover:bg-red-200"
}

export { sizeStyles, iconSizeStyle, importanceStyles };
export type { Size, Importance };
