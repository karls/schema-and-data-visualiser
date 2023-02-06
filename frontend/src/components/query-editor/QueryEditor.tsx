import React from "react";
import { Input } from 'antd';
import { observer } from "mobx-react-lite";

const { TextArea } = Input;

const QueryEditor: React.FC = observer(() => (
  <>
    <TextArea rows={10} allowClear/>
  </>
));

export default QueryEditor;