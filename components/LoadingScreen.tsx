import Image from "next/image";

export default function LoadingScreen() {

    return (
        <div className="absolute z-10 w-screen h-screen flex flex-col justify-center items-center bg-white ">
            <div>
                <Image src="/assets/loading-spinner.gif" width="50" height="50"/>
            </div>
        </div>
    )

}