import { useQuery } from 'react-query';

import { Country, Region } from 'types';

export const useRegionList = (countryIso: Country['iso']) => {
  const result = useQuery<Region[]>(['region-list', countryIso], () =>
    fetch(
      `${process.env.NEXT_PUBLIC_RW_API_URL}/query/Political-boundaries-Admin-1-level-GADM-36?sql=SELECT+iso%2C+name_1+AS+name%2C+gid_1+AS+id+FROM+gadm36_adm1+WHERE+iso%3D'${countryIso}'+ORDER+BY+name+ASC`
    )
      .then((res) => res.json())
      .then(({ data }) => data)
  );

  return {
    ...result,
    data: result.data,
  };
};
