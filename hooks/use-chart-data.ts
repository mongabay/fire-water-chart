import { useQuery } from 'react-query';

import { Country, Region, ChartData } from 'types';

export const useChartData = (date: string, countryIso: Country['iso'], regionId?: Region['id']) => {
  const result = useQuery<ChartData>(['chart-data', date, countryIso, regionId], () =>
    fetch(`${process.env.NEXT_PUBLIC_CLOUD_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        iso: countryIso,
        adm1: regionId ? +regionId : '',
        date_text: date,
      }),
    }).then((res) => res.json())
  );

  return {
    ...result,
    data: result.data,
  };
};
