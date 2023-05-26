import { useMemo } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { QueryResults, VariableCategories } from "../../types";
import countries from "../../utils/countries.json";

type ChoroplethMapProps = {
  results: QueryResults;
  variables: VariableCategories;
  width: number;
  height: number;
};

const ChoroplethMap = ({ results, variables, width, height }: ChoroplethMapProps) => {
  const legendItems = [];
  // const legendItemsReverse = [...legendItems].reverse();

  const data = useMemo(() => {
    const geoColumn = variables.geographical[0] ?? variables.key[0];
    const geoIndex = results.header.indexOf(geoColumn);
    const valueColumn = variables.scalar[0];
    const valueIndex = results.header.indexOf(valueColumn);
    const { features } = countries as any;
    const geoValue = {};

    let minValue = Number.MAX_SAFE_INTEGER;
    let maxValue = Number.MIN_SAFE_INTEGER;
    for (let row of results.data) {
      const location = row[geoIndex];
      const value = parseFloat(row[valueIndex]);
      minValue = Math.min(minValue, value);
      maxValue = Math.max(maxValue, value);
      geoValue[location] = value;
    }
    console.log(geoValue);

    return features.map((location: any) => {
      const { ADMIN, ISO_A3 } = location.properties;
      const value = geoValue[ADMIN] || geoValue[ISO_A3] || 0;
      location.properties.value = value;
      location.properties.text = value.toLocaleString();
      location.properties.color = `rgba(255,0,0,${
        (value - minValue) / (maxValue - minValue)
      })`;

      return location;
    });
  }, [results.data, results.header, variables.geographical, variables.key, variables.scalar]);

  return (
    <div>
      {data.length === 0 ? (
        <Loading />
      ) : (
        <div>
          <WorldMap countries={data} width={width - 50} height={height} />
          {/* <Legend legendItems={legendItemsReverse} /> */}
        </div>
      )}
    </div>
  );
};

const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Loading...
    </div>
  );
};

const Legend = ({ legendItems }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {legendItems.map((item: any) => (
        <div
          key={item.title}
          style={{
            backgroundColor: item.color,
            flex: 1,
            display: "flex",
            alignItems: "center", // vertical
            justifyContent: "center", // horiztontal
            color: item.textColor != null ? item.textColor : "black",
            fontWeight: "bolder",
            fontSize: "1em",
            height: "10vh",
          }}
        >
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
};

const WorldMap = ({ countries, width, height }) => {
  const mapStyle = {
    fillColor: "white",
    weight: 1,
    color: "black",
    fillOpacity: 1,
  };

  const onEachLocation = (country: any, layer: any) => {
    layer.options.fillColor = country.properties.color;
    const name = country.properties.ADMIN;
    const text = country.properties.text;
    layer.bindPopup(`${name} ${text}`);
  };

  return (
    <MapContainer style={{ width, height }} zoom={2} center={[20, 60]}>
      <GeoJSON
        style={mapStyle}
        data={countries}
        onEachFeature={onEachLocation}
      />
    </MapContainer>
  );
};

export default ChoroplethMap;