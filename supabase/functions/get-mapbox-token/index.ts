
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Mapbox token from environment variables
    const mapboxToken = Deno.env.get('MAPBOX_API');
    
    if (!mapboxToken) {
      console.error('MAPBOX_API environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Mapbox API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate that it's a public token (starts with pk.)
    if (!mapboxToken.startsWith('pk.')) {
      console.error('MAPBOX_API must be a public token (starting with pk.)');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Mapbox API key format. Must use a public token (pk.*), not a secret token (sk.*)',
          details: 'Please update your MAPBOX_API secret in Supabase to use a public token'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the token to the client
    return new Response(
      JSON.stringify({ token: mapboxToken }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error retrieving Mapbox token:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
