import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import type { Site } from '../types';

interface Props {
  sites: Site[];
}

export default function SiteMap({ sites }: Props) {
  return (
    <div className="h-[440px] w-full rounded-sm overflow-hidden border border-[var(--hairline)]">
      <MapContainer center={[30, -20]} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {sites.map((s) => {
          const color =
            s.segment === 'defense' ? '#1e3a8a' :
            s.segment === 'commercial' ? '#ed8936' :
            '#4a5568';
          const radius = s.function === 'manufacturing' ? 9 : s.function === 'mro' ? 7 : 5;
          return (
            <CircleMarker
              key={s.site_id}
              center={[s.lat, s.lng]}
              radius={radius}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.75, weight: 1.5 }}
            >
              <Tooltip direction="top">
                <div className="text-xs">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-slate-500">{s.city}, {s.state || s.country}</div>
                  <div className="mt-1">{s.function} · {s.segment}</div>
                  {s.headcount > 0 && <div>{s.headcount.toLocaleString()} headcount</div>}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
