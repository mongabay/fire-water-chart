import { useQuery } from 'react-query';

import { Country } from 'types';

export const useCountryList = () => {
  const result = useQuery<Country[]>('country-list', async () => {
    const {
      data: { attributes },
    } = await fetch(
      `${process.env.NEXT_PUBLIC_RW_API_URL}/dataset/Political-boundaries-GADM-36`
    ).then((res) => res.json());

    const cartoApiUrl = new URL(attributes.connectorUrl).origin;
    const { tableName } = attributes;

    return await fetch(
      `${cartoApiUrl}/api/v2/sql?q=WITH+c+AS+(SELECT+iso%2C+name_0+FROM+${tableName}+WHERE+ST_Contains(ST_MakeEnvelope('-180'%2C+'-50.5'%2C+180%2C+50.5%2C+4326)%2C+the_geom))%2C+i+AS+(SELECT+iso%2C+name_0+FROM+${tableName}+WHERE+ST_Intersects(ST_MakeEnvelope('-180'%2C+'-50.5'%2C+180%2C+50.5%2C+4326)%2C+the_geom))+SELECT+i.iso%2C+i.name_0+AS+name%2C+c.name_0+IS+NULL+as+partial_data+FROM+c+FULL+OUTER+JOIN+i+ON+c.name_0+%3D+i.name_0 ORDER BY name ASC`
    )
      .then((res) => res.json())
      .then(({ rows }) => rows);
  });

  return {
    ...result,
    data: result.data,
  };
};
