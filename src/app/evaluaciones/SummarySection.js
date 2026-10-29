import SummaryCard from '@/components/shared/SummaryCard'

export default function SummarySection({
  evaluaciones = [],
  esAdmin = false
}) {

  const pendientes = evaluaciones.filter((e) => e.estado === 'pendiente').length
  const aprobadas = evaluaciones.filter((e) => e.estado === 'aprobada').length
  const refuerzo = evaluaciones.filter((e) => e.estado === 'refuerzo').length

  return (

    <section
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4

        gap-5
      "
    >

      <SummaryCard
        title="Total evaluaciones"
        total={evaluaciones.length}
      />

      {/* Los administradores no guardan resultados, solo ven el total */}
      {!esAdmin && (
        <>
          <SummaryCard title="Pendientes" total={pendientes} />
          <SummaryCard title="Aprobadas" total={aprobadas} />
          <SummaryCard title="Requieren refuerzo" total={refuerzo} />
        </>
      )}

    </section>

  )

}