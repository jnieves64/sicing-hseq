import { Search } from 'lucide-react'

export default function SearchBar() {
    return (
        <div className='w-[448px] h-[36px] bg-gray-100 rounded-xl flex items-center px-3 gap-2'>
            <Search 
                size={18}
                className='text-gray-400'
            />
            <input 
                type='text'
                placeholder='Buscar módulos, documentos...'
                className='bg-transparent outline-none text-sm w-full placeholder:text-gray-400'
            />
        </div>
    )
}