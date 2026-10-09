'use client'

import Breadcrumbs from '@/components/shared/Breadcrumbs'
import IndicadorForm from '../IndicadorForm'
import { crearIndicador } from '@/services/indicadoresAdminService'

export default function NuevoIndicadorPage() {

    return (
        <div className="p-8 space-y-6 max-w-5xl">

            <Breadcrumbs
                items={[
                    { label: 'Gestión de indicadores', href: '/admin/indicadores' },
                    { label: 'Nuevo indicador' }
                ]}
            />

            <div>
                <h1 className="text-2xl font-semibold text-black">Nuevo indicador</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Configura la información y los datos del indicador.
                </p>
            </div>

            <IndicadorForm onSubmit={crearIndicador} />

        </div>
    )

}