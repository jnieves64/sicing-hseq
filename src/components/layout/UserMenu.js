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
                    Virginia Vega
                </span>
                <span className="text-xs text-gray-500">
                    Jefa Administrativa
                </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                VV
            </div>
            <ChevronDown
                size={18}
                className="text-gray-500"
            />
        </button>
    )
}