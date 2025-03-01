import { ReactNode } from "react"

type PopupProps = {
    children: ReactNode
}

export default function Popup({children}: PopupProps){
    return <div className="p-4 bg-purple-600 absolute left-1/2 translate-x-[-50%] z-[50] popup-anim">{children}</div>
}