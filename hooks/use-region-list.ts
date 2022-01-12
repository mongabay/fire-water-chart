import { useQuery } from 'react-query';

import { Country, Region } from 'types';

export const useRegionList = (country: Country | undefined | null) => {
  const result = useQuery<Region[]>(
    ['region-list', country?.iso],
    () =>
      !!country
        ? fetch(
            country.partial_data
              ? `${process.env.NEXT_PUBLIC_RW_API_URL}/query/Political-boundaries-Admin-1-level-GADM-36?sql=SELECT+iso%2C+name_0%2C+name_1+AS+name%2C+gid_1+AS+id+FROM+gadm36_adm1+WHERE+iso%3D'${country.iso}'+AND+ST_Contains(ST_MakeEnvelope(%27-180%27%2C+%27-50.5%27%2C+180%2C+50.5%2C+4326)%2C+the_geom)+ORDER+BY+name+ASC`
              : `${process.env.NEXT_PUBLIC_RW_API_URL}/query/Political-boundaries-Admin-1-level-GADM-36?sql=SELECT+iso%2C+name_1+AS+name%2C+gid_1+AS+id+FROM+gadm36_adm1+WHERE+iso%3D'${country.iso}'+ORDER+BY+name+ASC`
          )
            .then((res) => res.json())
            .then(({ data }) =>
              data.map((d: any) => ({ ...d, id: d.id.match(/[A-Z]\.(\d+)_1/)[1] }))
            )
        : Promise.resolve([]),
    {
      enabled: !!country,
    }
  );

  return {
    ...result,
    data: result.data,
  };
};
