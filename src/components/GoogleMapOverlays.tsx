import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

export interface MapPolylineProps {
  path: google.maps.LatLngLiteral[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  icons?: google.maps.IconSequence[];
}

export const MapPolyline: React.FC<MapPolylineProps> = ({
  path,
  strokeColor = '#1a73e8',
  strokeWeight = 5,
  strokeOpacity = 0.95,
  icons,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length < 2) return;

    const polyline = new google.maps.Polyline({
      path,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      icons,
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity, icons]);

  return null;
};

export interface MapPolygonProps {
  paths: google.maps.LatLngLiteral[];
  fillColor: string;
  fillOpacity?: number;
  strokeColor: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  onClick?: () => void;
}

export const MapPolygon: React.FC<MapPolygonProps> = ({
  paths,
  fillColor,
  fillOpacity = 0.3,
  strokeColor,
  strokeWeight = 2,
  strokeOpacity = 0.9,
  onClick,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || paths.length < 3) return;

    const polygon = new google.maps.Polygon({
      paths,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      map,
    });

    let listener: google.maps.MapsEventListener | null = null;
    if (onClick) {
      listener = polygon.addListener('click', onClick);
    }

    return () => {
      if (listener) google.maps.event.removeListener(listener);
      polygon.setMap(null);
    };
  }, [map, paths, fillColor, fillOpacity, strokeColor, strokeWeight, strokeOpacity, onClick]);

  return null;
};
