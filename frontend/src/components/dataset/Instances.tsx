import { useEffect, useState } from "react";
import { URI } from "../../types";
import {
  getInstances,
  getAllTypes,
} from "../../api/dataset";
import {
  Collapse,
  Divider,
  Select,
  Skeleton,
  Tooltip,
} from "antd";
import { removePrefix } from "../../utils/queryResults";
import { DataProperties } from "./DataProperties";

const Instances = ({ repository }) => {
  const [allTypes, setAllTypes] = useState<URI[]>([]);
  const [type, setType] = useState<URI | null>(null);
  const [instances, setInstances] = useState<URI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllTypes(repository).then((res) => {
      setAllTypes(res);
    });
  }, [repository]);

  return (
    <>
      <Select
        placeholder={"Select type"}
        style={{ width: 200 }}
        value={type}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        onChange={(value) => {
          setLoading(true);
          setType(value);
          getInstances(repository, value).then((res) => {
            setInstances(res);
            setLoading(false);
          });
        }}
        options={allTypes.map((t) => {
          return {
            label: removePrefix(t),
            value: t,
          };
        })}
      />

      {type && (
        <>
          <Divider>{instances.length} results</Divider>
          <Skeleton active loading={loading}>
            <Collapse defaultActiveKey={["1"]} onChange={() => {}}>
              {instances.map((uri: URI, index) => (
                <Collapse.Panel
                  header={<Tooltip title={uri}>{removePrefix(uri)}</Tooltip>}
                  key={`type-${index}`}
                >
                  <DataProperties repository={repository} uri={uri} />
                </Collapse.Panel>
              ))}
            </Collapse>
          </Skeleton>
        </>
      )}
    </>
  );
};

export default Instances;
