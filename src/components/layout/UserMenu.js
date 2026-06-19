import { ChevronDown } from "lucide-react";

export default function UserMenu({ isLoggedIn }) {
    if (!isLoggedIn) {
        return (
            <button className="h-[36px] px-4 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-100 transition-all">
                Iniciar Sesión
            </button>
        )
    }

    return (
        <button className="h-[36px] flex items-center gap-3 hover:bg-gray-100 px-2 rounded-xl transition-all">
            <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-medium text-gray-900">
                    Carlos Garcia
                </span>
                <span className="text-xs text-gray-500">
                    Supervisor HSEQ
                </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                CG
            </div>
            <ChevronDown
                size={18}
                className="text-gray-500"
            />
        </button>
    )
}