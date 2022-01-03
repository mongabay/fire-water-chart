import { useQuery } from 'react-query';

import { Country } from 'types';

export const useCountryList = () => {
  const result = useQuery<Country[]>('country-list', () =>
    fetch(
      `${process.env.NEXT_PUBLIC_RW_API_URL}/query/Political-boundaries-GADM-36?sql=SELECT+iso%2C+name_0+AS+name+FROM+gadm36_countries+WHERE+ST_Contains(ST_MakeEnvelope(%27-180%27%2C+%27-50.5%27%2C+180%2C+50.5%2C+4326)%2C+the_geom)+ORDER+BY+name+ASC`
    )
      .then((res) => res.json())
      .then(({ data }) => data)
  );

  return {
    ...result,
    data: result.data,
  };
};
