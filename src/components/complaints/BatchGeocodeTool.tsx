import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MAPBOX_GEOCODE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

export default function BatchGeocodeTool({ mapboxToken }: { mapboxToken: string }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const geocodeAddress = async (address: string) => {
    const url = `${MAPBOX_GEOCODE_URL}${encodeURIComponent(address)}.json?access_token=${mapboxToken}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].center;
      return { lat, lon };
    }
    throw new Error('No geocode result');
  };

  const handleBatchGeocode = async () => {
    setLoading(true);
    setErrors([]);
    setDone(false);
    // Fetch complaints missing lat/lon
    const { data: complaints, error } = await supabase
      .from('Police_Data_Complaints')
      .select('*')
      .is('latitude', null);
    if (error) {
      setErrors([error.message]);
      setLoading(false);
      return;
    }
    setTotal(complaints.length);
    let completed = 0;
    for (const complaint of complaints) {
      try {
        const { lat, lon } = await geocodeAddress(complaint.location || '');
        await supabase
          .from('Police_Data_Complaints')
          .update({ latitude: lat, longitude: lon })
          .eq('complaint_id', complaint.complaint_id);
      } catch (err: any) {
        setErrors(prev => [...prev, `ID ${complaint.complaint_id}: ${err.message}`]);
      }
      completed++;
      setProgress(completed);
      // Throttle to avoid rate limits
      await new Promise(res => setTimeout(res, 250));
    }
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-2">Batch Geocode Complaints</h3>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleBatchGeocode}
        disabled={loading}
      >
        {loading ? 'Geocoding...' : 'Start Batch Geocoding'}
      </button>
      {loading || done ? (
        <div className="mt-4">
          <div>Progress: {progress} / {total}</div>
          {done && <div className="text-green-600 font-semibold">Done!</div>}
          {errors.length > 0 && (
            <div className="mt-2 text-red-600">
              <div>Errors:</div>
              <ul className="text-xs">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
} 