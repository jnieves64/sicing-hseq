import { Menu } from 'lucide-react'
import HeaderBrand from './HeaderBrand'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

export default function Header({ onMenuClick }) {
    return (
        <header className='w-full h-[60px] bg-white border-b border-gray-300 sticky top-0 z-50'>
            <div className='max-w-[1200px] h-full mx-auto px-3 sm:px-6 flex items-center justify-between gap-3'>

                <div className="flex items-center gap-2 sm:gap-3">

                    {onMenuClick && (
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-gray-100"
                        >
                            <Menu size={22} className="text-gray-700" />
                        </button>
                    )}

                    <HeaderBrand />

                </div>

                <SearchBar />
                <UserMenu />

            </div>
        </header>
    )
}