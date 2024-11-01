const ClerkLayout = ({
    children
}:{
    children:React.ReactNode
}) =>{
    return (
        <div className="h-full flex items-center justify-center bg-neutral-100">
            {children}
        </div>
    )
}
export default ClerkLayout;