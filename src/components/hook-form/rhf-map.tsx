'use client';

import Box from '@mui/material/Box';
import { FormLabel } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { Map, Pin, APIProvider, AdvancedMarker } from '@vis.gl/react-google-maps';

import { MAP_ID, MAP_KEY, MAP_DEFAULT_ZOOM, MAP_DEFAULT_CENTER } from '../map/config-map';

interface Props {
  label?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
  markerPosition: { lat: number; lng: number };
  onMapClick: (coords: { lat: number; lng: number }) => void;
}

export default function RHFMap({
  label,
  defaultCenter,
  defaultZoom,
  markerPosition,
  onMapClick,
}: Props) {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Box>
      <FormLabel sx={{ mb: 0.5, display: 'block' }} error={!!(errors.latitude || errors.longitude)}>
        {label}
      </FormLabel>
      <Box
        height="20rem"
        borderRadius={1}
        overflow="hidden"
        border={(theme) =>
          `solid 1px ${
            !errors.latitude && !errors.longitude ? theme.palette.divider : theme.palette.error.main
          }`
        }
      >
        <APIProvider apiKey={MAP_KEY}>
          <Box height="100%">
            <Map
              defaultCenter={defaultCenter || MAP_DEFAULT_CENTER}
              defaultZoom={defaultZoom ?? MAP_DEFAULT_ZOOM}
              disableDefaultUI
              mapId={MAP_ID}
              onClick={(e) => {
                const coords = e.detail.latLng;
                if (coords?.lat != null && coords?.lng != null) {
                  onMapClick({ lat: coords.lat, lng: coords.lng });
                }
              }}
            >
              <AdvancedMarker position={markerPosition}>
                <Pin />
              </AdvancedMarker>
            </Map>
          </Box>
        </APIProvider>
      </Box>
    </Box>
  );
}
