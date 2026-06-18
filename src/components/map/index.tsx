'use client';

import Box from '@mui/material/Box';
import { Position } from 'src/types/map';
import { useState, useCallback } from 'react';
import { Map, Pin, APIProvider, AdvancedMarker } from '@vis.gl/react-google-maps';

import { MAP_ID, MAP_KEY, MAP_DEFAULT_ZOOM, MAP_DEFAULT_CENTER } from './config-map';

type Props = {
  staticPosition?: boolean;
  defaultPosition?: Position | undefined;
  defaultZoom?: number | undefined;
  onChange?: (newPosition: Position) => void;
};

export function GoogleMap({ staticPosition, defaultPosition, defaultZoom, onChange }: Props) {
  const [position, setPosition] = useState<Position | undefined>(defaultPosition);

  const handleChange = useCallback(
    (e: any) => {
      setPosition((prev) => {
        const newPosition: Position | undefined = e.detail.latLng ? { ...e.detail.latLng } : prev;
        if (onChange && newPosition) onChange(newPosition);
        return staticPosition ? prev : newPosition;
      });
    },
    [onChange, staticPosition]
  );

  return (
    <APIProvider apiKey={MAP_KEY}>
      <Box height="100%">
        <Map
          defaultCenter={defaultPosition || MAP_DEFAULT_CENTER}
          defaultZoom={defaultZoom ?? MAP_DEFAULT_ZOOM}
          disableDefaultUI
          mapId={MAP_ID}
          onClick={handleChange}
        >
          {position ? (
            <AdvancedMarker position={position}>
              <Pin /* background={"gray"} borderColor={"green"} glyphColor={"purple"} */ />
            </AdvancedMarker>
          ) : null}
        </Map>
      </Box>
    </APIProvider>
  );
}
