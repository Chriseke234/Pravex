"use client";

import { useState, useEffect, useRef } from 'react';
import { Asset } from '@/app/api/markets/route';

export function useMarketData() {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Track previous prices to determine flash color
  const prevPricesRef = useRef<Record<string, number>>({});
  const [priceDirections, setPriceDirections] = useState<Record<string, 'up' | 'down'>>({});

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/markets');
        if (!res.ok) throw new Error('Network response was not ok');
        
        const json: Asset[] = await res.json();
        
        if (mounted) {
          const newDirections: Record<string, 'up' | 'down'> = {};
          
          json.forEach(asset => {
            const prevPrice = prevPricesRef.current[asset.id];
            // If we have a previous price and it changed, determine direction
            if (prevPrice && asset.price !== prevPrice) {
              newDirections[asset.id] = asset.price > prevPrice ? 'up' : 'down';
            }
            // Update reference for next tick
            prevPricesRef.current[asset.id] = asset.price;
          });

          // Trigger flash animation
          if (Object.keys(newDirections).length > 0) {
            setPriceDirections(newDirections);
            
            // Clear animation state after 800ms (matches CSS duration)
            setTimeout(() => {
              if (mounted) setPriceDirections({});
            }, 800);
          }

          setData(json);
          setLastUpdated(json[0]?.lastUpdated || new Date().toISOString());
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
          setLoading(data.length === 0); // Only show global loading if we have no fallback data
        }
      }
    };

    // Initial fetch
    fetchData();

    // Set polling interval for 30 seconds
    interval = setInterval(fetchData, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [data.length]);

  return { data, loading, error, lastUpdated, priceDirections };
}
