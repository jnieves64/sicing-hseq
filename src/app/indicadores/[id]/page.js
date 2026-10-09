import AuthGuard from '@/components/auth/AuthGuard'
import IndicadorDetallePageView from './IndicadorDetallePageView'

export default function IndicadorDetallePage() {
    return (
        <AuthGuard ruta="/indicadores">
            <IndicadorDetallePageView />
        </AuthGuard>
    )
}