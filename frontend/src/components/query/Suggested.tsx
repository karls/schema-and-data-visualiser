import { useMemo, useState } from "react";
import {
  TbRelationManyToMany,
  TbRelationOneToMany,
  TbRelationOneToOne,
} from "react-icons/tb";
import { CgArrowLongLeftC, CgArrowLongRightC } from "react-icons/cg";
import { QueryAnalysis, QueryResults, RelationType } from "../../types";
import { getColumnRelationship } from "../../utils/charts";
import {
  Card,
  Modal,
  Segmented,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";

type SuggestedProps = {
  queryAnalysis: QueryAnalysis;
  results: QueryResults;
};
export const Suggested = ({ queryAnalysis, results }: SuggestedProps) => {
  return (
    <>
      <ColumnRelations
        keyColumns={queryAnalysis.variables.key}
        results={results}
      />
    </>
  );
};

const relationIcons: { [key: string]: JSX.Element } = {
  [RelationType.ONE_TO_ONE]: (
    <TbRelationOneToOne title="One to one" size={30} />
  ),
  [RelationType.ONE_TO_MANY]: (
    <TbRelationOneToMany title="One to many" size={30} />
  ),
  [RelationType.MANY_TO_MANY]: (
    <TbRelationManyToMany title="Many to many" size={30} />
  ),
};

type ColumnRelationsProps = {
  results: QueryResults;
  keyColumns: string[];
};
const ColumnRelations = observer(
  ({ keyColumns, results }: ColumnRelationsProps) => {
    return (
      <Card title="Entity Relationships">
        <Space>
          {keyColumns.map((colA, i) =>
            keyColumns.map((colB, j) => {
              return (
                i < j && <Relation results={results} colA={colA} colB={colB} />
              );
            })
          )}
        </Space>
      </Card>
    );
  }
);

const RelationDetails = ({ colA, colB, incomingLinks, outgoingLinks }) => {
  const [value, setValue] = useState<string>("Outgoing");
  const links = useMemo(
    () => (value === "Outgoing" ? outgoingLinks : incomingLinks),
    [incomingLinks, outgoingLinks, value]
  );
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Segmented
        options={[
          {
            label: (
              <>
                {colA} <CgArrowLongRightC size={20} /> {colB}
              </>
            ),
            value: "Outgoing",
          },
          {
            label: (
              <>
                {colA} <CgArrowLongLeftC size={20} /> {colB}
              </>
            ),
            value: "Incoming",
          },
        ]}
        value={value}
        onChange={(v) => setValue(v as string)}
      />
      <Table
        pagination={{
          position: ["topCenter"],
        }}
        columns={[
          {
            title: value === "Outgoing" ? colA : colB,
            dataIndex: "parent",
            key: "parent",
          },
          {
            title: value === "Outgoing" ? colB : colA,
            dataIndex: "children",
            key: "children",
            render: (children) => (
              <>
                {children.map((child: any) => (
                  <Tag key={child}>{child}</Tag>
                ))}
              </>
            ),
          },
        ]}
        dataSource={Object.keys(links).map((parent, index) => {
          return {
            key: `${index}`,
            parent,
            children: Array.from(links[parent]),
          };
        })}
      />
    </Space>
  );
};
const Relation = observer(({ colA, colB, results }: any) => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { relationType, left, right, outgoingLinks, incomingLinks } =
    useMemo(() => {
      let { relationType, outgoingLinks, incomingLinks } =
        getColumnRelationship(results, colA, colB);
      setLoading(false);
      let left = colA;
      let right = colB;
      if (relationType === RelationType.MANY_TO_ONE) {
        left = colB;
        right = colA;
        relationType = RelationType.ONE_TO_MANY;
      }
      return { left, right, relationType, outgoingLinks, incomingLinks };
    }, [colA, colB, results]);

  return (
    <Skeleton loading={loading} active>
      <Card
        bodyStyle={{ padding: 10 }}
        hoverable
        onClick={() => setShowModal(true)}
      >
        <Space>
          <Typography.Text>{left}</Typography.Text>
          {relationIcons[relationType]}
          <Typography.Text>{right}</Typography.Text>
        </Space>
      </Card>
      <Modal
        open={showModal}
        title={
          <Space>
            <Typography.Text>{colA}</Typography.Text>
            {relationIcons[relationType]}
            <Typography.Text>{colB}</Typography.Text>
          </Space>
        }
        footer={null}
        onCancel={() => setShowModal(false)}
        width={Math.floor(settings.screenWidth * 0.75)}
      >
        <RelationDetails
          colA={colA}
          colB={colB}
          incomingLinks={incomingLinks}
          outgoingLinks={outgoingLinks}
        />
      </Modal>
    </Skeleton>
  );
});
