'use client';
import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

const brasilTopo = '/mapa/brasil-completo.geojson';

const BrasilMap = () => {
  const [filiais] = useState([
    // São Paulo - 6 filiais
    {
      id: 1,
      nome: 'Filial SP - Capital',
      estado: 'SP',
      latitude: -23.55,
      longitude: -46.63,
    },
    {
      id: 2,
      nome: 'Filial SP - Campinas',
      estado: 'SP',
      latitude: -22.9,
      longitude: -47.06,
    },
    {
      id: 3,
      nome: 'Filial SP - Santos',
      estado: 'SP',
      latitude: -23.96,
      longitude: -46.33,
    },
    {
      id: 4,
      nome: 'Filial SP - Ribeirão Preto',
      estado: 'SP',
      latitude: -21.17,
      longitude: -47.81,
    },
    {
      id: 5,
      nome: 'Filial SP - Sorocaba',
      estado: 'SP',
      latitude: -23.5,
      longitude: -47.45,
    },
    {
      id: 6,
      nome: 'Filial SP - São José do Rio Preto',
      estado: 'SP',
      latitude: -20.81,
      longitude: -49.38,
    },

    // Rio de Janeiro - 4 filiais
    {
      id: 7,
      nome: 'Filial RJ - Capital',
      estado: 'RJ',
      latitude: -22.9,
      longitude: -43.17,
    },
    {
      id: 8,
      nome: 'Filial RJ - Niterói',
      estado: 'RJ',
      latitude: -22.88,
      longitude: -43.11,
    },
    {
      id: 9,
      nome: 'Filial RJ - Volta Redonda',
      estado: 'RJ',
      latitude: -22.52,
      longitude: -44.1,
    },
    {
      id: 10,
      nome: 'Filial RJ - Campos',
      estado: 'RJ',
      latitude: -21.75,
      longitude: -41.32,
    },

    // Mato Grosso - 2
    {
      id: 11,
      nome: 'Filial MT - Cuiabá',
      estado: 'MT',
      latitude: -15.6,
      longitude: -56.1,
    },
    {
      id: 12,
      nome: 'Filial MT - Rondonópolis',
      estado: 'MT',
      latitude: -16.47,
      longitude: -54.64,
    },

    // Minas Gerais - 3
    {
      id: 13,
      nome: 'Filial MG - BH',
      estado: 'MG',
      latitude: -19.92,
      longitude: -43.94,
    },
    {
      id: 14,
      nome: 'Filial MG - Uberlândia',
      estado: 'MG',
      latitude: -18.91,
      longitude: -48.27,
    },
    {
      id: 15,
      nome: 'Filial MG - Juiz de Fora',
      estado: 'MG',
      latitude: -21.76,
      longitude: -43.35,
    },

    // Bahia - 3
    {
      id: 16,
      nome: 'Filial BA - Salvador',
      estado: 'BA',
      latitude: -12.97,
      longitude: -38.5,
    },
    {
      id: 17,
      nome: 'Filial BA - Feira de Santana',
      estado: 'BA',
      latitude: -12.25,
      longitude: -38.96,
    },
    {
      id: 18,
      nome: 'Filial BA - Vitória da Conquista',
      estado: 'BA',
      latitude: -14.86,
      longitude: -40.84,
    },

    // Paraná - 2
    {
      id: 19,
      nome: 'Filial PR - Curitiba',
      estado: 'PR',
      latitude: -25.43,
      longitude: -49.27,
    },
    {
      id: 20,
      nome: 'Filial PR - Londrina',
      estado: 'PR',
      latitude: -23.3,
      longitude: -51.16,
    },
  ]);

  const [selectedFilial, setSelectedFilial] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMarkerClick = (filial) => {
    setSelectedFilial(filial);
    setDialogOpen(true);
  };

  return (
    <div>
      <h2>🗺️ Mapa de Filiais</h2>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [-55, -15],
        }}
        width={1000}
        height={800}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={brasilTopo}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const estadoGeo = geo.id;
              const isFilial = filiais.some(
                (filial) => filial.estado === estadoGeo
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isFilial ? '#c1121F' : '#d1d1d1'}
                  stroke="#FFFFFF"
                  strokeWidth={0.7}
                />
              );
            })
          }
        </Geographies>

        {filiais.map((filial) => (
          <Marker
            key={filial.id}
            coordinates={[filial.longitude, filial.latitude]}
            onClick={() => handleMarkerClick(filial)}
            style={{
              default: { cursor: 'pointer' },
              hover: { opacity: 0.8, cursor: 'pointer' },
            }}
          >
            <circle r={5} fill="#FF5722" stroke="#FFFFFF" strokeWidth={1.5} />
          </Marker>
        ))}
      </ComposableMap>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedFilial?.nome}</DialogTitle>
            <DialogDescription className="flex flex-col">
              <span>
                <strong>Estado:</strong> {selectedFilial?.estado}
              </span>
              <span>
                <strong>Latitude:</strong> {selectedFilial?.latitude}
              </span>
              <span>
                <strong>Longitude:</strong> {selectedFilial?.longitude}
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrasilMap;
