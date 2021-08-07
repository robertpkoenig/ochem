interface IController {
    handleLeftPress(): void
    handleRightPress(): void
    handleUpPress(): void
    handleDownPress(): void
    handleSpacePress(): void
    handleXPress(): void

    handleLeftRelease(): void
    handleRightRelease(): void
    handleUpRelease(): void
    handleDownRelease(): void
    handleMousePressed(): void
}

export default IController