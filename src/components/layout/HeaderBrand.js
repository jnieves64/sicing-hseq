export default function HeaderBrand() {
    return (
        <div className="flex items-center gap-3 h-[40px]">
            <img
                src="https://i.postimg.cc/4NtL7hHh/image-(7).png" 
                alt="SICING"
                className="h-full object-contain"
            />
            <div className="flex flex-col justify-center leading-tight">
                <h1 className="text-sm font-semibold text-gray-900">
                    SICING
                </h1>
                <p className="text-xs text-gray-500">
                    Portal HSEQ
                </p>
            </div>
        </div>
    )
}