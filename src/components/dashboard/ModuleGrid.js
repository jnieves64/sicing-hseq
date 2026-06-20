'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import ModuleCard from './ModuleCard'

export default function ModuleGrid() {

  const [modules, setModules] = useState([])

  useEffect(() => {
    getModules()
  }, [])

  async function getModules() {

    const { data, error } = await supabase
      .from('modulos')
      .select('*')
      .order('orden', { ascending: true })

    if (error) {
      console.error(error)
    } else {
      setModules(data)
    }
  }

  return (
    <div className="w-full max-w-[1216px] mx-auto px-6 pb-12">

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6
      ">

        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
          />
        ))}

      </div>

    </div>
  )
}