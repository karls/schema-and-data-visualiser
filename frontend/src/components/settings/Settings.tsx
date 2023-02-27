import { Drawer, FloatButton, Switch, Tooltip } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { useStore } from "../../stores/store";
import { Typography } from 'antd';

const { Text } = Typography;

const Settings = () => {
  const { settings } = useStore();
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
        /> <Text>Dark Mode</Text>
      </Drawer>
    </>
  );
};

export default observer(Settings);
