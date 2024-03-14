export default function ChartsWorkspace({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grow pt-4 pr-4 pb-4">
            <div className="h-full flex-grow bg-gray-900 border border-gray-500 overflow-auto">
                {children}
            </div>
        </div>
    )
}