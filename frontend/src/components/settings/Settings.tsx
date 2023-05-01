import {
  Alert,
  Button,
  Divider,
  Drawer,
  FloatButton,
  Input,
  Space,
  Switch,
  Tooltip,
} from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { useStore } from "../../stores/store";
import { Typography } from "antd";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { isURL } from "../../utils/queryResults";
import { getGraphdbURL, updateGraphdbURL } from "../../api/graphdb";

const { Text } = Typography;

const Settings = () => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip placement="topLeft" title="Settings">
        <FloatButton
          icon={<IoMdSettings size={25} style={{ paddingRight: 7 }} />}
          onClick={showDrawer}
        />
      </Tooltip>
      <Drawer title="Settings" placement="right" onClose={onClose} open={open}>
        <Switch
          checked={settings.darkMode}
          onChange={(checked: boolean) => settings.setDarkMode(checked)}
          checkedChildren={<MdDarkMode style={{ marginBottom: 2 }} />}
          unCheckedChildren={<MdLightMode style={{ marginBottom: 2 }} />}
        />{" "}
        <Text>Dark Mode</Text>
        <Divider />
        <GraphDBLink />
        <Divider />
        <Alert message="The backend currently supports the N-Triples syntax." banner />
      </Drawer>
    </>
  );
};

const GraphDBLink = observer(() => {
  const [url, setUrl] = useState("");
  const [initialUrl, setInitialUrl] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getGraphdbURL().then((url) => {
      setInitialUrl(url);
      setUrl(url);
    });
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Text>GraphDB URL:</Text>
      <Input
        status={!isURL(url) ? "error" : ""}
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setVisible(false);
        }}
        style={{ width: "100%" }}
      />
      {!visible && (
        <Button
          disabled={!isURL(url) || url === initialUrl}
          title={!isURL(url) ? 'URL is not valid' : ''}
          onClick={() => {
            updateGraphdbURL(url).then(() => {
              setInitialUrl(url);
              setVisible(true);
              setTimeout(() => setVisible(false), 1000);
            });
          }}
        >
          Update
        </Button>
      )}
      {visible && <Alert message="Update was successful!" type="success" />}
    </Space>
  );
});

export default observer(Settings);
