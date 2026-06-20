import HeaderBrand from './HeaderBrand'
import SearchBar from './SearchBar'
import UserMenu from './UserMenu'

export default function Header() {
    return (
        <header className='w-full h-[60px] bg-white border-b border-gray-300 sticky top-0 z-50'>
            <div className='max-w-[1200px] h-full mx-auto px-6 flex items-center justify-between'>
                <HeaderBrand />
                <SearchBar />
                <UserMenu isLoggedIn={true} />
            </div>
        </header>
    )
}