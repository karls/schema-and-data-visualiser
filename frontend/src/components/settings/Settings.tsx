import {
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
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { useStore } from "../../stores/store";
import { Typography } from "antd";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { isURL } from "../../utils/queryResults";

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
      </Drawer>
    </>
  );
};

const GraphDBLink = observer(() => {
  const rootStore = useStore();
  const settings = rootStore.settingsStore;

  const [url, setUrl] = useState(settings.graphdbURL);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Text>GraphDB URL:</Text>
      <Input
        status={!isURL(url) ? "error" : ""}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%" }}
      />
      <Button disabled={!isURL(url)} onClick={() => settings.setGraphdbURL(url)}>Update</Button>
    </Space>
  );
});

export default observer(Settings);
