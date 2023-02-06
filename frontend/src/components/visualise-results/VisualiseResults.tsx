import React from "react";
import { observer } from "mobx-react-lite";
import { Skeleton } from "antd";

const VisualiseResults: React.FC = observer(() => {
    return (
        <>
            <Skeleton />
        </>
    );
});

export default VisualiseResults;