import { useState } from "react";
import { Input, Space } from "antd";
import { PropertyValues } from "./DataProperties";
import { PropertyType, URI } from "../../types";
import { isURL } from "../../utils/queryResults";

const Details = ({ repository }) => {
  const [uri, setUri] = useState<URI>("");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        placeholder="Enter a URI to view its data properties"
        value={uri}
        onChange={(event) => {
          const value = event.currentTarget.value;
          setUri(value);
        }}
        style={{ width: "100%" }}
      />
      {isURL(uri as string) && (
        <PropertyValues
          repository={repository}
          uri={uri}
          propType={PropertyType.DatatypeProperty}
        />
      )}
    </Space>
  );
};

export default Details;
